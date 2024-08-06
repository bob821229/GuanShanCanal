function ifAnyCollection(v){
  return (v.length > 0);
} 
function ifValidOrganizationId(value){
  console.log('ifValidOrganizationId', this.user.organizationId);
  console.log('ifValidOrganizationId', value, (value != null))
  if(this.user.organizationId < 0){
    return(value != null);
  }else{
    return true;
  }
}