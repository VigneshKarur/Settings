import { Component, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { faPlus,faTrashCan, faPaste, faCopy, faRotateLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: "app-dynamic-fields",
  templateUrl: "./dynamic-fields.component.html",
  styleUrls: ["./dynamic-fields.component.css"],
})
export class DynamicFieldsComponent implements OnInit{
  data: any
  isLoading=true
  faPlus=faPlus
  faTrash=faTrashCan
  faPaste=faPaste
  faCopy=faCopy
  faUndo = faRotateLeft
  
  ngOnInit() {
    fetch("https://jsonplaceholder.typicode.com/posts").then((res)=>res.json()).then((data)=>{this.isLoading=false;this.data=data;

  })
  
  }
  submit()
  {
    return this.data
  }
  studentForm: FormGroup = new FormGroup({
    studentList: new FormArray([]),  
  });
  lineForm: FormGroup = new FormGroup({
    studentList: new FormArray([]),  
  });  

  getStudentFields(): FormGroup {
    
    return new FormGroup({
      name: new FormControl(""),
      description: new FormControl(""),
      dataId: new FormControl(""),
      speed: new FormControl(""),
      technology: new FormControl(""),
      machineCount: new FormControl(""),
      studentSubjects: new FormGroup({
        studentSubjectArray: new FormArray([]),
      }),
    });
  }

  putNewSubject() {
    return new FormGroup({
      m_name: new FormControl(""),
      m_description: new FormControl(""),
      m_dataId: new FormControl(""),
    });
  }

  studentListArray() {
    return this.studentForm.get("studentList") as FormArray;
  }

  addStudent() {
    
    this.studentListArray().push(this.getStudentFields());
  }

  removeStudent(i: number) {
    this.studentListArray().removeAt(i);
  }

  subjectsFormGroup(i: number) {
    return this.studentListArray().at(i).get("studentSubjects") as FormGroup;
  }

  subjectsArray(i: number) {
    return this.subjectsFormGroup(i).get("studentSubjectArray") as FormArray;
  }

  addNewSubject(i: number) {
    this.subjectsArray(i).push(this.putNewSubject());
  }

  removeNewSubject(i: number, j: number) {
    this.subjectsArray(i).removeAt(j);
  }

  getFormData() {
    let serverData: any = [],
      tempStudentFormData = JSON.parse(JSON.stringify(this.studentForm.value));
    tempStudentFormData.studentList.forEach((element: any) => {
      let tempObj: any = {
        name: element.student_name,
        class: element.student_class,
        age: element.student_age,
        subject: [],
      };
      element.studentSubjects.studentSubjectArray.forEach(
        (elementSubjectObj: any) => {
          let tempSubObj: any = {
            subject: elementSubjectObj.subject,
            marks: elementSubjectObj.marks,
          };
          tempObj.subject.push(tempSubObj);
        }
      );
      tempObj.subject = JSON.stringify(tempObj.subject);
      serverData.push(tempObj);
    });
    
    console.log(serverData);  // This is the variable which contain all the form data
    /*

      Here we have 4 columns ( keys )
      #name
      #class
      #age
      #subject

      FOR SQL :- Now we can store it very simply in mysql database you only need to create one table which contain 4 columns name (type = varchar), class (type = varchar), age (teype = varchar) and subject (type = json)
      FOR NoSQL :- It is very simple in noSQL databases like MONGODB here we have 4 keys and only we need to store the information in db
    */
  }
}