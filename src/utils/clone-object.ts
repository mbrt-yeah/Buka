import { plainToClass } from '@marcj/marshal';
import Type from '@/utils/type';

const cloneObject = function<T>(object: T, type: Type<T>): T {
    const objectCloned = JSON.parse( JSON.stringify(object) );
    return plainToClass<T>(type, objectCloned);
}

export default cloneObject;