var classes;
classes = [
    {
        name: "Técnicas de Programación",
        starts: 15,
        ends: 17,
        days: ['Domingo','Lunes','Martes', "Miércoles",'Jueves','Viernes','Sábado'],
        classRoom: 'A-207'
    },
    {
        name: "Electrónica Básica",
        starts: 18,
        ends: 19,
        days: ['Domingo','Lunes','Martes', "Miércoles",'Jueves','Viernes','Sábado'],
        classRoom: 'B-103'
    }
];

var days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

const nextClass = () => {
    const actualDate = new Date();
    const actualDay = days[actualDate.getDay()];
    const actualHour = actualDate.getHours();
    const nextclasses = classes.filter((aClass) => {
        if (aClass.starts > actualHour && classes[0].days.indexOf(actualDay) > 1){
            return true
        }
        else {
            return false
        }
    });
    const nextClass = nextclasses.sort((a, b) => {
        return a.starts > b.starts
    });

    if(nextClass.length >= 1) {
        return (nextClass[0].name + ', en el salón: ' + nextClass[0].classRoom + ' y empieza a las ' + nextClass[0].starts + ' hrs.');
    }
    else {
        return ('No tienes más clases por hoy, pero tal vez deberías revisar tus tareas.');
    }

};

const nextClasses = () => {
    const actualDate = new Date();
    const actualDay = days[actualDate.getDay()];
    const actualHour = actualDate.getHours();
    const nextclasses = classes.filter((aClass) => {
        if (aClass.starts > actualHour && classes[0].days.indexOf(actualDay) > 1){
            return true
        }
        else {
            return false
        }
    });
    return nextclasses.sort((a, b) => {
        return a.starts > b.starts
    });
};

module.exports = {
    classes,
    nextClass,
    nextClasses
};