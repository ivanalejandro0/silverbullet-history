const filePath = "qwer.md";
const command = new Deno.Command("git", {
  cwd: "../../space/",
  args: ['status', '--porcelain', '--', filePath]
});

let result = await command.output();
result = command.outputSync();

// ?? file.ext -> not in git
// M file.ext -> has uncommitted changes
// A file.ext -> has staged but uncommitted changes
// nothing -> all committed

const textDecoder = new TextDecoder();
// console.log("stderr:", textDecoder.decode(result.stderr));
// console.log("stdout:");
const output = textDecoder.decode(result.stdout).trim()
console.log(output);
console.log(output === "");
console.log({output});

let st = "";
if (!output) {
  st = "ok"
} else {
  const [flag, name] = output.split(' ');
  switch (flag) {
    case "??":
      st = "not tracked"
      break;
    case "M":
      st = "has uncommitted changes"
      break;
    case "A":
      st = "has staged but uncommitted changes"
      break;
    default:
      break;
  }
}

console.log({st})
