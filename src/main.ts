import { bootstrapApplication } from "@angular/platform-browser"
import { provideRouter } from "@angular/router"
import { AdminComponent } from "@/app/page.admin"
import { IndexComponent } from "@/app/page.index"
import { Component } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { AppService } from "@/app/service"
import { DashboardComponent } from "./app/page.dashboard"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
  constructor(private app: AppService) {}

  ngOnInit() {
    this.app.initialize()
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: "", component: IndexComponent },
      { path: "admin", component: AdminComponent },
      { path: "dashboard", component: DashboardComponent },
      { path: "**", component: IndexComponent },
    ]),
  ],
}).catch((err) => console.error(err))
