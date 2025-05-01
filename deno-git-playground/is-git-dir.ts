const command = new Deno.Command("git", {
  cwd: "../../empty_space/",
  args: ["rev-parse", "--is-inside-work-tree"]
});

let result = await command.output();
result = command.outputSync();

const textDecoder = new TextDecoder();
// console.log("stderr:", textDecoder.decode(result.stderr));
// console.log("stdout:");
const output = textDecoder.decode(result.stdout)
console.log(output.trim());

console.log(output.trim() === "true");
