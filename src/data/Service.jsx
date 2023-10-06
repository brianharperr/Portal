export default class Service{
    ID;
    Name;
    Description;
    constructor(data){
        this.ID = data?.ID;
        this.Name = data?.Name;
        this.Description = data?.Description;
    }
}