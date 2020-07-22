import * as React from "react";
import {fromEvent} from 'rxjs'
import "./styles.css";

export default function App() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(()=>{
    if(inputRef?.current){
      const keyup$ = fromEvent(inputRef.current,'keyup')
      keyup$.subscribe((event)=>{
        console.log('사용자 입력의 KeyboardEvent',event)
      });
    }
  },[])

  return (
    <div className="App">
      <input
        id="search"
        type="input"
        ref={inputRef}
        placeholder="검색하고 싶은 사용자 아이디를 입력해주세요"
      />
    </div>
  );
}
