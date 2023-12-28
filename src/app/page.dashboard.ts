import { Component, OnInit } from "@angular/core"
import { AppService } from "@/app/service"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { BehaviorSubject } from "rxjs"
import { Question, Rank, TeamRank } from "./types"

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="p-8">
      <h1 class="text-4xl text-center">
        現在
        <span class="text-8xl mx-4">{{ app.questionId$ | async }}</span>
        問目
      </h1>
      <!-- ルーレット -->
      <div class="flex flex-col items-center my-8">
        <div class="flex gap-4 items-center mt-4 text-center mb-8">
          <p class="w-80 text-4xl whitespace-nowrap">{{ reelItem1 }}</p>
          <p class="w-96 text-4xl whitespace-nowrap">{{ reelItem2 }}</p>
          <p class="w-96 text-4xl whitespace-nowrap">{{ reelItem3 }}</p>
        </div>
        <button (click)="startAndStopButton()" class="btn text-2xl">
          ボタン
        </button>
        <p class="text-gray-400 my-2 text-xs">powered by g-ueno</p>
      </div>
      <div class="flex w-full overflow-hidden space-x-32 justify-center">
        @if ((this.teamRanking$ | async)![0]) {
          <div class="flex w-80 items-end text-4xl space-x-4">
            <p>1位</p>
            <p>チーム<span class="mx-2">{{ (this.teamRanking$ | async)![0].id }}</span></p>
            <p>{{ (this.teamRanking$ | async)![0].total }}点</p>
          </div>
        }
        @if ((this.teamRanking$ | async)![1]) {
          <div class="flex w-80 items-end text-3xl space-x-4">
            <p>2位</p>
            <p>チーム<span class="mx-2">{{ (this.teamRanking$ | async)![1].id }}</span></p>
            <p>{{ (this.teamRanking$ | async)![1].total }}点</p>
          </div>
        }
        @if ((this.teamRanking$ | async)![2]) {
          <div class="flex w-80 items-end text-2xl space-x-4">
            <p>3位</p>
            <p>チーム<span class="mx-2">{{ (this.teamRanking$ | async)![2].id }}</span></p>
            <p>{{ (this.teamRanking$ | async)![2].total }}点</p>
          </div>
        }
      </div>
      @if ((this.teamRanking$ | async)![3]) {
        <p class="mt-4 text-xs text-center">以下大きく写す価値なし</p>
        <div class="flex w-full overflow-hidden space-x-4 mt-4 justify-center">
          @for (
            team of this.under;
            track team.id;
            let i = $index
          ) {
            <div class="flex w-60 space-x-2">
              <p>{{ i + 4}}位</p>
              <p>チーム{{ team.id }}</p>
              <p>{{ team.total }}点</p>
            </div>
          }
        </div>
      }
      <div class="flex flex-col gap-4 items-center mt-4">
        @for (user of this.ranking; track user.uid; let i = $index) {
          <div class="flex items-center w-full">
            <p class="mr-4 whitespace-nowrap">{{ i + 1 }}位</p>
            <p class="mr-4 w-40 first-letter:whitespace-nowrap truncate">
              {{ user.name }}
            </p>
            <progress
              class="progress progress-accent w-full mr-4"
              [value]="user.total"
              max="25"
            ></progress>
            <p class="w-4">{{ user.total }}</p>
          </div>
        }
      </div>
      @if (this.ranking.length !== 0) {
        <p class="mt-4 text-xs">以下写す価値なし</p>
      }
    </main>
  `,
})
export class DashboardComponent implements OnInit {
  questions$ = new BehaviorSubject<Question[]>([])
  ranking$ = new BehaviorSubject<Rank[]>([])
  teamRanking$ = new BehaviorSubject<TeamRank[]>([])

  ranking: Rank[] = []
  under: TeamRank[] =[]

  constructor(public app: AppService) {}

  ngOnInit() {
    this.app.syncAllQuestions(this.questions$)

    this.questions$.subscribe((questions) => {
      this.app.syncAllResults(this.ranking$, this.teamRanking$, questions)
    })

    this.ranking$.subscribe((ranking) => {
      this.ranking = ranking.slice(0, 10)
    })

    this.teamRanking$.subscribe((teamRanking) => {
      this.under = teamRanking.slice(3, 8)
    })
  }

  // 質問の内容
  // もっと良い書き方があるだろ…とは思う
  reel1 = [
    "俺 0号",
    "俺 1号",
    "俺 2号",
    "俺 3号",
    "俺 4号",
    "俺 5号",
    "俺 6号",
    "俺 7号",
    "俺 8号",
    "俺 9号",
  ] //質問のターゲット;
  reel2 = [
    "",
    "実は",
    "本当は",
    "今年",
    "今日",
    "〇〇",
    "昔",
    "毎日",
    "たまに",
    "趣味が",
    "いままで",
    "すごく",
    "どちらかといえば",
    "いつか",
  ]
  // 質問の分岐
  reel3_1 = ["が好き", "が大好き♡", "が大大大好き♡♡♡"]
  reel3_2 = [
    "隠している趣味がある",
    "秘密がある",
    "異なる惑星からやって来た",
    "歌うことが好き",
    "二か国語を操る",
    "ピカチュウ",
    "YouTuber",
    "幽霊をみたことがある",
    "いて座",
    "動物に好かれる",
    "カラオケが好き",
    "やりたいことがある",
    "猫派",
    "たけのこ派",
    "O型",
    "下に兄弟がいる",
    "文系",
    "特許を持っている",
    "一週間以上の食欲不振がある",
    "株をしている",
    "パチプロ",
    "宝くじが当たったことがある",
    "電車通勤",
    "貨幣コレクター",
    "歴史好き",
    "すごいものを持っている",
    "無垢",
    "化粧品コレクター",
  ] // 実は
  reel3_3 = [
    "海より山が好き",
    "全てを知っている",
    "昔は悪かった",
    "自炊が好き",
    "占いを信じている",
    "かわいい",
    "夜型人間",
    "ベジタリアン",
    "偽物",
    "部屋が綺麗",
    "アウトドア派",
    "雨が好き",
    "早生まれ",
    "もっと遊びに誘って欲しい",
    "ヤバい",
    "天才",
    "棋士",
  ] // 本当は
  reel3_4 = [
    "が好き",
    "が大好き",
    "を愛してる",
    "が何よりも好き",
    "is LOVE.",
    "のことが好き",
    "超好き",
    "すこ",
  ] // jig.jp
  reel3_5 = [
    "の抱負を守れた",
    "良い一年だった",
    "何かに勝った",
    "旅行をした",
    "動物を飼った",
    "無駄遣いをした",
    "映画を3本以上見た",
    "成長支援制度を使った",
    "新しい特技を覚えた",
    "メガネを買い替えた",
    "スマホを買い替えた",
    "車を買った",
    "身長が伸びた",
    "強くなった",
    "クリスマスを一人で過ごす",
    "放置しているカレンダーがある",
    "三つ以上アニメを見た",
    "は速かった気がする",
  ] // 今年
  reel3_6 = [
    "布団から出るのが辛かった",
    "朝ごはんを食べた",
    "を繰り返している",
    "をすごく楽しみにしていた",
    "猫を見た",
    "ランニングをした",
    "お酒を飲んだ",
    "暑い気がする",
    "エモい気がする",
    "二次会に出る",
    "はオールナイト",
  ] // 今日
  reel3_7 = [
    "が好き",
    "が欲しい",
    "したことがある",
    "へ行ったことがある",
    "を見たことがある",
  ] // 〇〇
  reel3_8 = [
    "に戻りたい",
    "運動部だった",
    "は振り返らない",
    "の映画をたまにみる",
    "は別の業種を目指していた",
    "は地元最強だった",
    "の家電が好き",
    "に行ってみたい",
    "ワニをみた",
  ] // 昔
  reel3_9 = [
    "同じ時間に起きる",
    "朝食を食べている",
    "お風呂に入る",
    "健康に気をつかっている",
    "ニュースをみている",
    "ストレッチをする",
    "楽しい",
    "幸せを噛み締めている",
    "１０時には寝る",
    "が楽しい",
    "エナドリを飲んでいる",
    "筋トレしている",
    "ちゃんと寝ている",
  ] // 毎日
  reel3_10 = [
    "夜空を見上げる",
    "しか掃除をしない",
    "一日六食以上食べる",
    "笑う",
    "踊る",
    "歌う",
    "腰が痛い",
    "歯磨きをする",
    "一日中寝ている",
    "前世を思い出す",
  ] // たまに
  reel3_11 = [
    "絵を書くこと",
    "写真を撮ること",
    "インターネットサーフィン",
    "アウトドア",
    "ドライブ",
    "カフェ巡り",
    "美術館巡り",
    "ゲーム",
    "昆虫採集",
    "登山",
    "開発",
  ] // 趣味が
  reel3_12 = [
    "海外旅行に行ったことがある",
    "サーフィンをしたことがある",
    "富士山に登ったことがある",
    "素潜りをしたことがある",
    "何かで優勝したことがある",
  ] // いままで
  reel3_13 = [
    "足が速い",
    "歌がうまい",
    "文章を書くのが上手",
    "忙しい",
    "すごい",
    "オタク",
    "SFが好き",
    "夜目が利く",
    "視力が高い",
    "寒がり",
    "酔っ払ってる",
    "洋楽マニア",
  ] // すごく
  reel3_14 = [
    "希望がある",
    "万能感がある",
    "甘いものより辛いものが好き",
    "映画より本が好き",
    "未来より今が大事",
    "本は電子派",
    "年下に見られる",
    "だんごむし派",
    "人前で話すのが得意",
    "冷静",
    "過去の経験から学ぶのが得意",
    "人よりも覚えるのが早い",
    "創造的な思考が得意",
    "プレッシャーに強い",
    "歩く速さが早い",
    "芸術が分かる",
    "20度設定は寒いと思う",
    "お金に興味がない",
    "優しい",
    "暗がりが好き",
    "大志を抱いている",
    "サイボーグ人間になりたい",
    "火属性",
    "南国が好き",
    "爬虫類大丈夫",
    "グルメ",
  ] // どちらかといえば
  reel3_15 = [
    "叶えたい夢がある",
    "高級車を買いたい",
    "アイドルになりたい",
    "猫になりたい",
    "世界一周したい",
    "別荘がほしい",
    "大富豪になりたい",
    "映画監督になりたい",
    "宇宙飛行士になりたい",
    "野球選手になりたい",
    "オリンピックに出たい",
    "特許が欲しい",
    "世界を征服したい",
    "本当の自分を見つけたい",
    "サメになりたい",
    "翼がほしい",
  ] // いつか
  // ↓全て入れてしまう
  reel3 = [
    this.reel3_1,
    this.reel3_2,
    this.reel3_3,
    this.reel3_4,
    this.reel3_5,
    this.reel3_6,
    this.reel3_7,
    this.reel3_8,
    this.reel3_9,
    this.reel3_10,
    this.reel3_11,
    this.reel3_12,
    this.reel3_13,
    this.reel3_14,
    this.reel3_15,
  ]
  reel1_copy = this.reel1
  // おんなじ要素が沢山だから配列？とか構造体？とかにしたほうが良さそうだけど
  // よくわからないのでしませんでした
  private pollingInterval1: number | null = null
  private pollingInterval2: number | null = null
  private pollingInterval3: number | null = null
  reelItem1: string | undefined
  reelItem2: string | undefined
  reelItem3: string | undefined
  reel1_num = 0
  reel2_num = 0
  reel3_num = 0
  startAndStopButton(): void {
    // おんなじ処理が沢山だし長いので外部関数？にして纏めたほうが良さそうだけど
    // よくわからないのでしませんでした
    if (
      (this.pollingInterval1 === null && this.pollingInterval2 === null,
      this.pollingInterval3 === null)
    ) {
      // 全員当たったらルーレットを設定し直す
      if (this.reel1.length == 0) {
        this.reel1 = this.reel1_copy
      }
      // ルーレットが回ってないときはルーレットを回す
      // 1つめのルーレットを回す処理
      if (this.pollingInterval1 === null) {
        this.pollingInterval1 = window.setInterval(() => {
          this.reel1_num++
          if (this.reel1_num >= this.reel1.length) {
            this.reel1_num = 0
          }
          this.reelItem1 = this.reel1[this.reel1_num] + "さんは"
        }, 100)
      }
      // ２つめのルーレットを回す処理
      if (this.pollingInterval2 === null) {
        this.pollingInterval2 = window.setInterval(() => {
          this.reel2_num++
          if (this.reel2_num >= this.reel2.length) {
            this.reel2_num = 0
          }
          if (this.reel2_num == 0) {
            // 対象が人名のときは対象の名前をルーレット
            this.reelItem2 =
              this.reel1[Math.floor(Math.random() * this.reel1.length)] + "さん"
          } else {
            this.reelItem2 = this.reel2[this.reel2_num]
          }
        }, 100)
      }
      // ３つめのルーレットを回す処理
      // ２つめのルーレットの結果によって分岐する
      if (this.pollingInterval3 === null) {
        this.pollingInterval3 = window.setInterval(() => {
          this.reel3_num++
          if (this.reel3_num >= this.reel3[this.reel2_num].length) {
            this.reel3_num = 0
          }
          this.reelItem3 = this.reel3[this.reel2_num][this.reel3_num]
        }, 100)
      }
    } else if (this.pollingInterval1 != null) {
      // 1つめのルーレットを止める処理
      clearInterval(this.pollingInterval1)
      this.pollingInterval1 = null
      // 一度当たった人は配列から消してしまう
      this.reel1 = this.reel1.filter(
        (item) => item !== this.reel1[this.reel1_num],
      )
    } else if (this.pollingInterval2 != null) {
      // ２つめのルーレットを止める処理
      clearInterval(this.pollingInterval2)
      this.pollingInterval2 = null
      // 適当に止めると結構質問が偏るので初期値をランダムにする
      this.reel3_num = Math.floor(
        Math.random() * this.reel3[this.reel2_num].length,
      )
    } else if (this.pollingInterval3 != null) {
      // ３つめのルーレットを止める処理
      clearInterval(this.pollingInterval3)
      this.pollingInterval3 = null
    }
  }
}
