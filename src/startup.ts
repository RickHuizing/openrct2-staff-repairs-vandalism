function getEntityTile(entity: Entity) {
    return map.getTile(Math.floor(entity.x / 32), Math.floor(entity.y / 32))
}

let entertainersBreakStuff = false
let update = -1
let tickPerUpdate = 40

function doUpdate() {
    if (update++ <= tickPerUpdate) return
    update = -1
    map.getAllEntities('staff').forEach((s: Staff) => {
        if (entertainersBreakStuff && s.staffType == 'entertainer' && s.costume == 4) {
            let tile = getEntityTile(s)
            tile.elements.forEach(element => {
                if (element.type == 'footpath') {
                    if (element.addition != null) {
                        element.isAdditionBroken = true
                    }
                }
            })
        }
        if (s.staffType == 'security') {
            let tile = getEntityTile(s)
            tile.elements.forEach(element => {
                if (element.type == 'footpath') {
                    if (element.addition != null && element.isAdditionBroken) {
                        context.executeAction('footpathadditionplace', {
                            x: tile.x * 32,
                            y: tile.y * 32,
                            z: element.baseZ,
                            object: element.addition
                        })
                    }
                }
            })
        }
    })
}


export function startup() {
    context.subscribe('interval.tick', doUpdate)
}