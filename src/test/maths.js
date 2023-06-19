import {PythonShell} from 'python-shell';

PythonShell.run('Splitter.py', null).then(messages=>{
  console.log(messages);
});   