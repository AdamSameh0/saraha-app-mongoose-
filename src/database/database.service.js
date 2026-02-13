

export let findOne =async ({
    modelName,
    filter = {},
    select = '',
    options = {}
})=>{
   let doc =  modelName.findOne(filter)
   if(select.length){
    doc.select
   }
   if(options.populate){
    doc.populate(options.populate)
   }
   return await doc
}

export let findById = async ({
  modelName,
  id
})=>{
    return await modelName.findById(id)
}