export default function makeDriver (subject) {
  return function driver (vtree$) {
    vtree$.subscribe(subject)
    return {subject}
  }
}
