import { Injectable } from "@angular/core"
import { FirebaseApp, initializeApp } from "firebase/app"
import {
  Firestore,
  addDoc,
  collection,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore"
import {
  Auth,
  User,
  getAuth,
  signInAnonymously,
  updateProfile,
} from "firebase/auth"
import { BehaviorSubject } from "rxjs"
import { Question, Rank, Result, TeamRank } from "./types"
import { firebaseConfig } from '@/config'

@Injectable({
  providedIn: "root",
})
export class AppService {
  // ----- firebase application -----
  app!: FirebaseApp
  store!: Firestore
  auth!: Auth

  // ----- app state -----
  user$ = new BehaviorSubject<User | null | undefined>(undefined)
  questionId$ = new BehaviorSubject<number>(0)
  message$ = new BehaviorSubject<string>("")
  result: boolean | null = null

  constructor() {}

  /**
   * 初期化
   */
  public initialize() {
    this.app = initializeApp(firebaseConfig)
    this.store = getFirestore(this.app)
    this.auth = getAuth(this.app)

    this.getQuestionIdSync()
  }

  /**
   * 匿名ログイン
   */
  public async anonymouslyLogin() {
    try {
      const { user } = await signInAnonymously(this.auth)
      this.user$.next(user)
    } catch {
      this.message$.next("ログインできませんでした。")
    }
  }

  /**
   * 今何問目か取得する
   */
  public getQuestionIdSync() {
    onSnapshot(
      query(
        collection(this.store, "questions"),
        orderBy("id", "desc"),
        limit(1),
      ),
      (querySnapshot) => {
        if (querySnapshot.empty) {
          this.questionId$.next(1)
        }
        querySnapshot.forEach((doc) => {
          const result = doc.data() as Result

          this.questionId$.next(Number(result.id) + 1)
          if (this.result === null) return

          if (this.result === result.result) {
            let i = 0
            const timer = window.setInterval(() => {
              i++
              window["confetti"].apply(this)
              if (i === 5) {
                clearInterval(timer)
                this.message$.next("")
              }
            }, 500)

            this.result = null
            this.message$.next("正解!!!")
          } else {
            this.message$.next("不正解!!!")
          }
        })
      },
    )
  }

  /**
   * すべてのデータを取得する
   * @param select 問題リスト | 回答リスト
   */
  public async syncAllQuestions<T>(questions$: BehaviorSubject<T[]>) {
    const q = query(collection(this.store, "questions"), orderBy("id", "desc"))
    onSnapshot(q, (querySnapshot) => {
      let list: T[] = []
      querySnapshot.forEach((doc) => {
        list.push(doc.data() as T)
      })
      questions$.next(list)
    })
  }

  /**
   * 正解している回答だけ取得
   * TODO: ここやばい
   */
  public async syncAllResults(
    ranking$: BehaviorSubject<Rank[]>,
    teamRanking$: BehaviorSubject<TeamRank[]>,
    questions: Question[],
  ) {
    let ranking: { [uid: string]: Rank } = {}
    let teamRanking: { [id: string]: TeamRank } = {}

    for (const question of questions) {
      const q = query(
        collection(this.store, "results"),
        where("result", "==", question.result),
        where("id", "==", question.id),
        orderBy("id", "desc"),
      )
      onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const result = doc.data() as Result

          ranking[result.uid] = {
            uid: result.uid,
            name: result.name,
            total: ranking[result.uid] ? ranking[result.uid].total + 1 : 1,
          }

          teamRanking[result.team] = {
            id: result.team,
            total: teamRanking[result.team] ? teamRanking[result.team].total + 1 : 1,
          }

          teamRanking$.next(this.convertArray(teamRanking))
          ranking$.next(this.convertArray(ranking))
        })
      })
    }
  }

  private convertArray (v: any) {
    const array = Object.keys(v).map(function (key) {
      return v[key]
    })

    const sort = array.sort(function (a, b) {
      return a.total > b.total ? -1 : 1
    })

    return sort
  }

  /**
   * まるばつの投稿
   */
  public async submitRightAndWrong(value: boolean) {
    if (!this.user$.value) return

    try {
      const querySnapshot = await getDocs(
        query(
          collection(this.store, "results"),
          where("uid", "==", this.user$.value.uid),
          orderBy("id", "desc"),
          limit(1),
        ),
      )
      querySnapshot.forEach((doc) => {
        if (this.questionId$.value === Number((doc.data() as any).id)) {
          const rightAndWrong = (doc.data() as any).result ? "まる" : "ばつ"
          throw new Error(`すでに ${rightAndWrong} で答えています。`)
        }
      })

      await addDoc(collection(this.store, "results"), {
        id: this.questionId$.value,
        result: value,
        uid: this.user$.value.uid,
        name: this.user$.value.displayName,
        team: Number(this.user$.value.displayName!.match(/#(\d+)$/)![1]),
      })

      this.result = value
      this.message$.next(`${value ? "まる" : "ばつ"}で回答しました。`)
    } catch (e) {
      if (e instanceof Error) this.message$.next(e.message)
      console.error(e)
    }
  }

  /**
   * 回答をセットする
   */
  public async setResult(value: boolean) {
    await addDoc(collection(this.store, "questions"), {
      id: this.questionId$.value,
      result: value,
    })
  }

  /**
   * 名前をセットする
   * @param name 名前
   * @param select チーム
   */
  public joinGame = async (name: string, select: string) => {
    if (!this.user$.value) return

    try {
      await updateProfile(this.user$.value, {
        displayName: `${name} #${select}`,
      })
      this.message$.next("名前を設定しました。")
    } catch (e) {
      this.message$.next("名前を設定できませんでした。")
    }
  }
}
