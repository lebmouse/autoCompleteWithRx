import { fromEvent } from "rxjs";
import { map } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
const $search = document.getElementById("search") as HTMLInputElement;

if ($search) {
  const keyup$ = fromEvent($search, "keyup").pipe(
    map(event => (event.target as HTMLInputElement).value),
    map(query => ajax.getJSON(`https://api.github.com/search/users?q=${query}`))
  );
  // observable 반환함

  keyup$.subscribe(value => console.log(value));
}
