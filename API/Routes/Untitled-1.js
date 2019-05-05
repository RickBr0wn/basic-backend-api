const req = { propName: 'name', value: 'Rick', test: 'test' }
const updateOps = {}
// for (const ops of req) {
//   updateOps[ops.propName] = ops.value
// }
for (let [key, value] of Object.entries(req)) {
  if (key === 'value') {
    updateOps[key] = value
  }
}

updateOps //?
