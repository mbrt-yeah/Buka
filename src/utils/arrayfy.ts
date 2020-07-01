const arrayfy = function<T>(param: T | T[]): T[] {
    return ( Array.isArray(param) ) ? param : [param];
}

export default arrayfy;