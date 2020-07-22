import { fromEvent } from "rxjs";
import { map } from "rxjs/operators";

const $search = document.getElementById("search") as HTMLInputElement;

if ($search) {
  const keyup$ = fromEvent($search, "keyup").pipe(
    map(event => (event.target as HTMLInputElement).value)
  );

  keyup$.subscribe(value => console.log(value));
}
