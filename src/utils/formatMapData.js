/*
 * 格式化地图数据
 */
export function formatMapData(json,data) {
    let userData = [];
    let features = json.features;
    for(let i in features) {     
        for(let j in data){
            if(data[j].name == features[i].properties.name){
                userData.push({
                    "name": data[j].name,
                    "value": data[j].value
                });
                break;
            }
        }

    }
   return userData; 
}

export function formatMapAllData(json,data) {
    let userData = [];
    let features = json.features;
    for(let i in features){
        let flag = false;
        for(let j in data){
            if(data[j].name == features[i].properties.name){
                flag = true;
                userData.push({
                    "name": data[j].name,
                    "value": data[j].value
                });   
                break;
            }
        }
        if(!flag){
            userData.push({
                "name": features[i].properties.name,
                "value": 0
            });     
        }       
    }  
    return userData; 
}