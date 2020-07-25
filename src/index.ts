import "./styles.css";
import { fromEvent, Observable } from "rxjs";
import {
  map,
  debounceTime,
  filter,
  distinctUntilChanged,
  mergeMap,
  tap,
  switchMap,
  catchError,
  retry
} from "rxjs/operators";
import { ajax } from "rxjs/ajax";

interface UserStatus {
  login: number;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: false;
  score: number;
}

interface GetUsers {
  total_count: number;
  incomplete_results: boolean;
  items: UserStatus[];
}

const $loading = document.getElementById("loading");

function showLoading() {
  if ($loading) {
    $loading.style.display = "block";
  }
}

function hideLoading() {
  if ($loading) {
    $loading.style.display = "none";
  }
}

const $layer = document.getElementById("suggestLayer") as HTMLUListElement;

const drawLayer = (items: UserStatus[]) => {
  if (items) {
    $layer.innerHTML = items
      .map(user => {
        return `<li class="user">
      <img src="${user.avatar_url}" width="50px" height="50px"/>
      <p><a href="${user.html_url}" target="_blank">${user.login}</a></p>
      </li>`;
      })
      .join("");
  }
};

function hideLayer(value: string) {
  $layer.innerHTML = "";
}

const $search = document.getElementById("search") as HTMLInputElement;

const keyup$ = fromEvent<KeyboardEvent>($search, "keyup").pipe(
  debounceTime(300),
  map(event => (event.target as HTMLInputElement).value),
  distinctUntilChanged()
);

const user$ = keyup$.pipe(
  filter(query => query.trim().length > 0),
  tap(showLoading),
  switchMap<string, Observable<GetUsers>>(query =>
    ajax.getJSON(`https://api.github.com/search/users?q=${query}`)
  ),
  tap(hideLoading),
  retry(2)
);

const reset$ = keyup$.pipe(
  filter(query => query.trim().length === 0),
  tap(hideLayer)
);

user$.subscribe(value => drawLayer(value.items));
reset$.subscribe();
