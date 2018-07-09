var assigments;

assigments = [
    {
        info: "Tarea de Cálculo",
        dueDate: "2018/07/15"
    }
];

const pendingAssigments = () => {

    var pendingAssigments = assigments.filter((assigment) => {
        const today = new Date();
        return( new Date(today.setDate(today.getDate() - 1)) < new Date(assigment.dueDate) );
    });

    var sortedPendingAssigments = pendingAssigments.sort((a, b) => {
        return new Date(a.dueDate) > new Date(b.dueDate)
    });

    return sortedPendingAssigments.splice(0,5);
};

const newAssigment = (info, dueDate) => {
    dueDate = dueDate.split('/').reverse().join('/');
    assigments.push({info: info, dueDate: dueDate});
};

module.exports = {
    assigments,
    pendingAssigments,
    newAssigment
};