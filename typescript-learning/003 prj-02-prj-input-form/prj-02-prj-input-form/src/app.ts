// Drag & Drop Project
interface Dragggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;  
}

// Project Type
enum ProjectStatus {
  Active = 'active',
  Finished = 'finished'
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

// Project state management
type Listener<T> = (projects: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn)
  }
}

class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super()
  }

  static getInstance() {
    if(this.instance) {
      return this.instance
    }
    this.instance = new ProjectState();
    return this.instance
  }
  
  addProject(title: string, description: string, people: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      people,
      ProjectStatus.Active
    )

    this.projects.push(newProject);
    this.updateListeners()
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find(project => project.id === projectId)

    if(project && project.status !== newStatus) {
      project.status = newStatus
      this.updateListeners()
    }
  }

  private updateListeners() {
    for(const listenerFn of this.listeners) {
      listenerFn(this.projects.slice())
    }
  }
}

const projectState = ProjectState.getInstance();

// validation
interface IValidateModel {
  value: string | number;
  require?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validateModel: IValidateModel) {
  const { value, require, minLength, maxLength, min, max } = validateModel;
  let isValid = true
  if(require) {
    isValid = isValid && value.toString().trim().length !== 0
  }

  if(minLength != null && typeof value === 'string') {
    isValid = isValid && value.toString().trim().length >= minLength
  }

  if(maxLength != null && typeof value === 'string') {
    isValid = isValid && value.toString().trim().length <= maxLength
  }

  if(min != null && typeof value === 'number') {
    isValid = isValid && value >= min
  }

  if(max != null && typeof value === 'number') {
    isValid = isValid && value <= max
  }

  return isValid
}

// autoBind decorator
function autoBind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = original.bind(this);
      return boundFn;
    }
  };
  return adjDescriptor;
}

// Component Base Class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string, 
    hostElementId: string, 
    insertAtStart: boolean,
    newElementId?: string,
    ) {
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart)
  }

  private attach(insertAtStart: boolean) {
    this.hostElement.insertAdjacentElement( 
      insertAtStart ? 'afterbegin' : 'beforeend', 
      this.element
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

// ProjectItem Class
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> 
implements Dragggable {
  private project: Project;

  get persons() {
    if (this.project.people === 1) {
      return '1 person'
    } else {
      return `${this.project.people} persons`
    }
  }

  constructor(
    hostId: string,
    project: Project
  ) {
    super('single-project', hostId, false, project.id);
    this.project = project

    this.configure();
    this.renderContent();
  }

  @autoBind //To get value "this", replace for bind()
  dragStartHandler(event: DragEvent): void {
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }

  dragEndHandler(_: DragEvent): void {
    console.log('DragEnd');
  }

  configure() {
    this.element.addEventListener('dragstart', this.dragStartHandler)
    this.element.addEventListener('dragend', this.dragEndHandler)
  }

  renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title
    this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
    this.element.querySelector('p')!.textContent = this.project.description
  }
}

// ProjectList Class
class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects` );
    
    this.assignedProjects = []
    
    this.configure()
    this.renderContent();
  }

  @autoBind
  dragOverHandler(event: DragEvent): void {
    if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.add('droppable')
    }
  }

  @autoBind
  dropHandler(event: DragEvent): void {
    const projectId = event.dataTransfer!.getData('text/plain');

    projectState.moveProject(projectId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
  }

  @autoBind
  dragLeaveHandler(_: DragEvent): void {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable')
  }

  configure() {
    this.element.addEventListener('dragover', this.dragOverHandler)
    this.element.addEventListener('dragleave', this.dragLeaveHandler)
    this.element.addEventListener('drop', this.dropHandler)

    projectState.addListener((projects: any[]) => {
      const filterProject = projects.filter((project: any) => {
        if (this.type === 'active') {
          return project.status === ProjectStatus.Active
        }
        return project.status === ProjectStatus.Finished
      })
      this.assignedProjects = filterProject
      this.renderProjects()
    });
  }

  renderContent() {
    const listId  = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
    listEl.innerHTML = '';
    for (const projectItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, projectItem)
    }
  }
}

// projectInput class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>  {

  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');

    this.titleInputElement = this.element.querySelector('#title')! as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description')! as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector('#people')! as HTMLInputElement;

    this.configure();
  }
  
  configure() {
    this.element.addEventListener('submit', this.submitHandler.bind(this));
  }

  renderContent() {}

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;
    
    const titleValidatable: IValidateModel = {
      value: enteredTitle,
      require: true,
    }

    const descriptionValidatable: IValidateModel = {
      value: enteredDescription,
      require: true,
      minLength: 5
    }

    const peopleValidatable: IValidateModel = {
      value: +enteredPeople,
      require: true,
      min: 1,
      max: 5
    }

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert('Invalid input, please try again!');
      return;
    } else {
      return [
        enteredTitle,
        enteredDescription,
        +enteredPeople
      ]
    }
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  @autoBind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput()

    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      projectState.addProject(title, description, people)
      
      this.clearInputs()
    }
  }
}

const prjInput = new ProjectInput();
const activeProjectsList = new ProjectList('active');
const finishedProjectsList = new ProjectList('finished');
