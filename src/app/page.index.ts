import { Component } from "@angular/core"
import { AppService } from "@/app/service"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

@Component({
  selector: "app-index",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="max-w-sm mx-auto text-center p-6">
      <h1 class="text-4xl mb-6">まるばつゲーム</h1>
      @if ((app.user$ | async)?.displayName) {
        <p class="mb-4">あなたの名前：{{ (app.user$ | async)?.displayName }}</p>
        <p>
          今
          <span class="text-red-500 text-4xl mx-2">{{
            app.questionId$ | async
          }}</span>
          問目！！
        </p>
        <div class="flex gap-8 justify-center mt-12">
          <button
            (click)="app.submitRightAndWrong(true)"
            class="w-28 h-28 bg-red-500 rounded-full text-white font-bold text-4xl"
          >
            まる
          </button>
          <button
            (click)="app.submitRightAndWrong(false)"
            class="w-28 h-28 bg-blue-500 rounded-full text-white font-bold text-4xl"
          >
            ばつ
          </button>
        </div>
        <div class="mt-8 border-gray-200 border-solid border p-4 rounded-lg">
          <p>{{ app.message$ | async }}</p>
        </div>
      } @else {
        <div>
          <p class="mb-4">なまえを決めてください</p>
          <input
            type="text"
            class="input input-bordered input-accent w-full max-w-xs mb-8"
            placeholder="なまえ"
            [(ngModel)]="name"
          />
          <p class="mb-2">チームを選択してください</p>
          <div class="text-start text-red-500 text-sm">
            <p class="mb-2">
              一度決めたチームは変更できません。間違えて入力するとあなたが答えた正解が別チームに加算されます！！
            </p>
          </div>
          <select class="select select-accent w-full max-w-xs mb-8" [(ngModel)]="select">
            <option selected value="1">チーム 1</option>
            <option value="2">チーム 2</option>
            <option value="3">チーム 3</option>
            <option value="4">チーム 4</option>
            <option value="5">チーム 5</option>
            <option value="6">チーム 6</option>
            <option value="7">チーム 7</option>
            <option value="8">チーム 8</option>
          </select>
          <button
            class="btn btn-sm btn-wide btn-neutral mb-8"
            (click)="app.joinGame(name, select)"
          >
            決定
          </button>
          <div class="text-start text-red-500 text-sm flex flex-col gap-1">
            <p>
              ※「あら捜し」や「悪意のあるデータの入力」などゲーム進行の妨げになる行為はご遠慮ください
            </p>
            <p>
              ※ 無料枠で運用しているので頻繁にリロードしないでください。動かなくなった時だけリロードしてください
            </p>
            <p>※ /admin にはアクセスしないでください</p>
            <p>※ /dashboard は大量のクエリを叩くので絶対にアクセスしないでください</p>
            <p>※ まるばつの再投票はできません。</p>
            <p>※ 企画終了後どうしてもらっても構いません</p>
            <p>※ ！！！！個人情報も入力しないで！！！！</p>
          </div>
        </div>
      }
    </main>
  `,
})
export class IndexComponent {
  name: string = ""
  select: string = "1"

  constructor(public app: AppService) {}

  ngOnInit() {
    this.app.anonymouslyLogin()
  }
}
