function convertToFakeUTCDate(d){
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), 0));
}

teste = new Date();
formatter = new Intl.DateTimeFormat("pt-BR", {
    timeZone: 'America/Sao_Paulo',
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).format(convertToFakeUTCDate(teste));
console.log(formatter);

