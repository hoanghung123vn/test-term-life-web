// eslint-disable-next-line consistent-return
export const findArrByKey = (arr: any[] | undefined, val: string) => {
    if (arr) {
        return arr.find(item => {
            return item['code'] == val;
        })
    }
}

export const categorizeConsecutiveNumbers = (arr: any[]) => {
    const result: any[] = [];
    let i = 0;
    const result2: any[] = [];
    const list = arr.sort((a, b) => a - b);

    list.forEach((item, index) => {
        if (index === 0) {
            result[0] = [item];
        } else if (item - list[index - 1] === 1) {
            result[i].push(item);
        } else {
            result[++i] = [item];
        }
    })
    for (const item of result) {
        if (item.length > 1) {
            result2.push(item[0] + ' to ' + item[item.length - 1]);
        } else {
            result2.push(item);
        }
    }
    return result2;
}

export interface FilterMapping { name: string, code: string, id?: string }
