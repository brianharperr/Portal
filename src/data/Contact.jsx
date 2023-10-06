export default class Contact{
    ID;
    PhoneNumber;
    Email;
    Name;
    Relation;
    constructor(data){
        this.ID = data?.ID;
        this.Name = data?.Name;
        this.PhoneNumber = data?.PhoneNumber;
        this.Email = data?.Email;
        this.Relation = data?.Relation;
    }
}