import { useEffect, useRef } from "react";


export default function AlwaysScrollToBottom() {
  const elementRef = useRef();
  useEffect(() => elementRef.current.scrollIntoView());
  return <div ref={elementRef} />;
}