export default class User{
    ID;
    FirstName;
    LastName;
    constructor(data){
        this.ID = data?.ID;
        this.FirstName = data?.FirstName;
        this.LastName = data?.LastName
    }
}