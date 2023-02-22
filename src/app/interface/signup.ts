export interface SignUp{
    name:string,
    email:string,
    password:string,
    id?:string
}
export interface Login{
    email:string,
    password:string,
}

export interface userInformation{
    name:string,
    email:string,
    password:string,
    phoneNumber:string,
    address:string,
    id?:string
}