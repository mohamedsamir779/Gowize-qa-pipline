export const checkAllBoxes = (selectAllCheckBoxClass, checkedBoxesClass)=>{
  const select =  document.getElementById(selectAllCheckBoxClass);
  const checkboxes =   document.querySelectorAll(checkedBoxesClass);
  for (let checkbox of checkboxes){
    checkbox.checked = select.checked;
  }
    
};