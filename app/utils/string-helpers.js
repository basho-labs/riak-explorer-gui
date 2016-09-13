// function inserts the string value (third parameter) before the specified integer index (second parameter) in the
// string str (first parameter), and then returns the new string without changing str!
// i.e insert("foo baz", 4, "bar ") => "foo bar baz";
export default function insert(str, index, value) {
  return str.substr(0, index) + value + str.substr(index);
}
