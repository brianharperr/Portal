export default class Home{
    ID;
    LocationID;
    Name;
    constructor(data){
        this.ID = data?.ID;
        this.LocationID = data?.LocationID;
        this.Name = data?.Name;
    }
}