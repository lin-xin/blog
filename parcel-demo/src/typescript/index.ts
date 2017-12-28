interface Name {
    value: string;
}
function showName(name: Name){
    document.getElementById('ts-app').innerHTML = 'Hello ' + name.value;
}

showName({value: 'TypeScript'});