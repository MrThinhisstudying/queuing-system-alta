export interface stateModel {
    title: string,
    path: string
}

export interface device {
    id: string,
    deviceCode: string,
    deviceName: string,
    deviceIP: string,
    activeStatus: string,
    connectStatus: string,
    deviceUse: string,
    username: string,
    password: string,
    deviceType: string,
}

export interface service{
    id: string,
    serviceCode: string,
    serviceName: string,
    description: string,
    activeStatus: string,
    dateCreate: string,
    rule: {name: string, value: string | number}[],
}

export interface account {
    id: string,
    username: string,
    fullname: string,
    phone: string,
    email: string,
    role: string,
    password: string,
    status: string,
    avatar: string,
}

export interface role {
    id: string,
    roleName: string,
    numberPeopleUse: number,
    description: string,
    features: {name: string, group: string }[]
}

export interface NumberLevel {
    id: string,
    stt: string,
    customer: string,
    device: string,
    service: string,
    status: string,
    timeuse: string,
    timeexpire: string,
    email: string,
    phone: string
}

export interface history {
    id: string,
    username: string,
    time: string,
    ip: string,
    content: string,
}

export interface DateType {
    day: number,
    month: number,
    year: number
}

export interface ServiceListUse {
    id: string,
    sequenceNumber: string,
    status: string
}

export interface report {
    number: string,
    name: string,
    date: string,
    status: string,
    device: string,
}

export interface notification {
    id: string,
    usernameRecive: string,
    time: string
}
