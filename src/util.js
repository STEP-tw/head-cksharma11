const parseInputs = function(inputs){
  let parsedInputs = {option : '-n', value : 10, fileNames : inputs};
  let option = inputs[0].match(/^-(n|c)/);

  if(inputs[0].startsWith('-') && isFinite(inputs[0][1])){
    parsedInputs.value = inputs[0].slice(1);
    parsedInputs.fileNames = inputs.slice(1)
    return parsedInputs;
  }

  if(option != null){
    parsedInputs.option = option[0];
    parsedInputs.value = inputs[0].substr(2);
    parsedInputs.fileNames = inputs.slice(1);
    if(parsedInputs.value == ''){
      parsedInputs.value = inputs[1];
      fileNames = inputs.slice(2);
    }
  } 
  return parsedInputs;
}

module.exports = {
  parseInputs
}
