import { Component } from "@angular/core"
import { AppService } from "@/app/service"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="max-w-sm mx-auto p-6 flex flex-col items-center">
      <p>
        <span class="mx-4">{{ app.questionId$ | async }}</span
        >問目の答え
      </p>
      <select
        [(ngModel)]="change"
        class="select select-accent w-full max-w-xs mt-8"
      >
        <option value="true" selected>まる</option>
        <option value="false">ばつ</option>
      </select>
      <button
        (click)="app.setResult(this.result)"
        class="btn btn-sm btn-wide mt-16"
      >
        submit
      </button>
    </main>
  `,
})
export class AdminComponent {
  result: boolean = false

  constructor(public app: AppService) {}

  set change(value: "true" | "false") {
    this.result = JSON.parse(value.toLowerCase())
  }
  get change(): string {
    return String(this.result)
  }

  ngOnInit() {
    this.app.anonymouslyLogin()
  }
}
