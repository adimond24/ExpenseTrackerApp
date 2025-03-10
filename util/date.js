// 
//this is the OG stuff but it is not working jk I accidentally deleted the old stuff
// export function getFormattedDate(date) {
//     if (!date || !(date instanceof Date) || isNaN(date)) {
//       console.warn("Invalid date passed to getFormattedDate:", date);
//       return "Invalid Date";
//     }
//     return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
//   }

export function getFormattedDate(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

export function getDateMinusDays(date, days) {
    const newDate = new Date(date.getTime());
    newDate.setDate(newDate.getDate() - days);
    return newDate;
}

  
