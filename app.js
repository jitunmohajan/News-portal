const loadCategories = async() =>{
    try {
        const url = `https://openapi.programming-hero.com/api/news/categories`
        const res = await fetch(url);
        const data = await res.json();
        displayCategories(data.data);
    }
    catch (error) {
        alert(error);
    }
}

const displayCategories = (categories) => {
    const categoriesContainer = document.getElementById('categories');
    
    categoriesContainer.textContent = '';
    categories.news_category.forEach(category => {
        
        const categoryLi  = document.createElement('li');
        categoryLi.classList.add('flex-sm-fill','text-sm-center','nav-link');
        

        categoryLi.innerText = `${category.category_name}`;
        categoriesContainer.appendChild(categoryLi);

        categoryLi.addEventListener("click", function(event){
            loadCategoryDetails(category.category_id,category.category_name);
            
            event.target.parentElement.childNodes.forEach(element=> {
                element.classList.remove('active');
            });
           
            event.target.classList.add("active");
        });
        
    });
    if (flag === 0) {
        document.getElementById("categories").firstChild.classList.add('active');
        flag=1;    
    }
}

const loadCategoryDetails = async(category_id,category_name) => {
    try {
        toggleSpinner(true);
        const url = `https://openapi.programming-hero.com/api/news/category/${category_id}`
        const res = await fetch(url);
        const data = await res.json();
        displayCategoryDetails(data.data,category_name);
    }
    catch (error) {
        alert(error);
    }
}

const displayCategoryDetails = (categoryDetails,category_name) => {

    const categoryDetailsContainer = document.getElementById('categoryDetails');
    categoryDetailsContainer.textContent = '';
    
    const numberOfItemsContainer = document.getElementById('numberOfItems');

    const fixedFooterContainer = document.getElementById('fixed-footer'); 
    if (categoryDetails.length > 0) {
        
        numberOfItemsContainer.textContent = `${categoryDetails.length} items found for ${category_name}`;
        
        // delete fixed footer style
        fixedFooterContainer.style.position = null;
        fixedFooterContainer.style.left = null;
        fixedFooterContainer.style.bottom = null;
        fixedFooterContainer.style.width = null;
    } else {
        numberOfItemsContainer.textContent = 'No news found';

        // fixed footer
        fixedFooterContainer.style.position = 'fixed';
        fixedFooterContainer.style.left = '0';
        fixedFooterContainer.style.bottom = '0';
        fixedFooterContainer.style.width = '100%';
    }

    categoryDetails.sort((a, b) => {
        return b.total_view - a.total_view;
    });
    
    categoryDetails.forEach(categoryDetail => {
        
        const categoryDetailDiv  = document.createElement('div');
        categoryDetailDiv.classList.add('col');
        categoryDetailDiv.innerHTML = `
            <div>
                <div class="card mb-3" style="width: 100%;">
                    <div class="row g-0 p-3">
                        <div class="col-md-3">
                        <img src="${categoryDetail.thumbnail_url}" class="img-fluid rounded-start w-100" alt="...">
                        </div>
                        <div class="col-md-9 pt-3">
                            <div class="card-body">
                                <h5 class="card-title">${categoryDetail.title}</h5>
                                <p class="card-text">${categoryDetail.details.length>400? categoryDetail.details.slice(0,400)+'...':categoryDetail.details}</p>


                                <div class="d-flex flex-wrap justify-content-between align-items-center">
                                
                                    <div class="d-flex">
                                        <img src="${categoryDetail.author.img}" style="width:50px;" class="img-thumbnail border-0 rounded-circle author-img" alt="...">
                                        <div class="ml-5">
                                            <p class="p-0 m-0">${categoryDetail.author.name? categoryDetail.author.name:'No data available'}</p>
                                            <p class="p-0 m-0"><small>${categoryDetail.author.published_date? categoryDetail.author.published_date.slice(0,10):'not found'} </small></p>
                                        </div>
                                    </div>

                                    <p class="m-0"><i class="fa-regular fa-eye"></i> ${categoryDetail.total_view!==null? categoryDetail.total_view:'No data available'}</p>
                                    
                                   
                                    <div class="d-flex">
                                        <i class="fa-regular fa-star-half-stroke"></i>
                                        <i class="fa-regular fa-star"></i>
                                        <i class="fa-regular fa-star"></i>
                                        <i class="fa-regular fa-star"></i>
                                        <i class="fa-regular fa-star"></i>
                                    </div>

                                    <div onclick="loadNewsDetail('${categoryDetail._id}')" class="text-primary fs-4" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                        <i class="fa-solid fa-arrow-right"></i>
                                    </div>
                                    


                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        categoryDetailsContainer.appendChild(categoryDetailDiv);
    });
    toggleSpinner(false);
}


const loadNewsDetail = async(newsId) => { 
    try {
        const url = `https://openapi.programming-hero.com/api/news/${newsId}`
        const res = await fetch(url);
        const data = await res.json();
        displayNewsDetail(data.data);
    }
    catch (error) {
        alert(error);
    }
}

const displayNewsDetail = (newsDetail) => {
    const newsDetailContainer = document.getElementById('newsDetail');
    newsDetailContainer.textContent = '';
    
    const newsDetailDiv  = document.createElement('div');
   
    newsDetailDiv.innerHTML = `
        <div>
            
            <img src="${newsDetail[0].image_url}" class="img-thumbnail w-100" alt="...">
            <h6 class="text-primary font-weight-bold fs-5"> ${newsDetail[0].title? newsDetail[0].title:'not found'}</h6>
            <p>${newsDetail[0].details? newsDetail[0].details:'not found'}</p>
            
            

            <div class="d-flex justify-content-between align-items-center">
                                    
                <div class="d-flex">
                    <img src="${newsDetail[0].author.img}" style="width:50px;" class="img-thumbnail border-0 rounded-circle author-img" alt="...">
                    <div class="ml-5">
                        <p class="p-0 m-0">${newsDetail[0].author.name? newsDetail[0].author.name:'No data available'}</p>
                        <p class="p-0 m-0"><small>${newsDetail[0].author.published_date.slice(0,10)} </small></p>
                    </div>
                </div>

                <p class="m-0"><i class="fa-regular fa-eye"></i> ${newsDetail[0].total_view!==null? newsDetail[0].total_view:'No data available'}</p>
                    
            </div>
        </div>
    `;
    newsDetailContainer.appendChild(newsDetailDiv);
    
}

const toggleSpinner = isLoading => {
    const loaderSection = document.getElementById('loader');
    if (isLoading) {
        loaderSection.classList.remove('d-none')
    }
    else{
        loaderSection.classList.add('d-none');
    }
}

const newsContainer=document.getElementById('news');
const blogContainer=document.getElementById('blog');
const numberOfItemsSectionContainer=document.getElementById('numberOfItemsSection');

newsContainer.addEventListener('click', function () {

    flag = 0;
    newsContainer.classList.add('active');
    blogContainer.classList.remove('active');
    numberOfItemsSectionContainer.classList.remove('d-none');

    const questionAnswerContainer = document.getElementById('questionAnswer');
    questionAnswerContainer.textContent = '';
    loadCategoryDetails('01','Breaking News');
    loadCategories();
})

blogContainer.addEventListener('click', function () {
    
    blogContainer.classList.add('active');
    newsContainer.classList.remove('active');
    numberOfItemsSectionContainer.classList.add('d-none');

    const categoriesContainer = document.getElementById('categories');
    categoriesContainer.textContent = '';
    const categoryDetailsContainer = document.getElementById('categoryDetails');
    categoryDetailsContainer.textContent = '';

    const questionAnswerContainer = document.getElementById('questionAnswer');
    questionAnswerContainer.textContent = '';
    
    const numberOfItems = document.getElementById('numberOfItems');
    numberOfItems.textContent = '';

    const questionAnswerDiv  = document.createElement('div');
    questionAnswerDiv.innerHTML = `
        <div class=" d-flex flex-column align-items-center">
                <div class="col-lg-8 mb-3">
                    <h2 class="text-center fw-semibold section-title">Question & Answer</h2>
                    
                </div>

                <div class="col-lg-8">
                    <div class="accordion" id="accordionExample">
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingOne">
                            <button class="accordion-button fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                What are the difference between var, let and const?
                            </button>
                            </h2>
                            <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                    var declarations are globally scoped or function scoped while let and const are block scoped.var variables can be updated and re-declared within its scope. let variables can be updated but not re-declared const variables can neither be updated nor re-declared.They are all hoisted to the top of their scope. But while var variables are initialized with undefined, let and const variables are not initialized. 
                                </div>
                            </div>
                        </div>
                        <div class="accordion-item mt-3 border border-2 rounded rounded-1">
                            <h2 class="accordion-header" id="headingTwo">
                            <button class="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                What are the difference between arrow function and regular function?
                            </button>
                            </h2>
                            <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                    Regular functions created using function declarations or expressions are constructible and callable. Since regular functions are constructible, they can be called using the new keyword. However, the arrow functions are only callable and not constructible, arrow functions can never be used as constructor functions. Arrow functions  a new feature introduced in ES6 enable writing concise functions in JavaScript. 
                                </div>
                            </div>
                        </div>
                        <div class="accordion-item mt-3 border border-2 rounded rounded-1">
                            <h2 class="accordion-header" id="headingThree">
                            <button class="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                What are the difference between map, foreach, filter and find?
                            </button>
                            </h2>
                            <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                    Foreach takes a callback function and run that callback function on each element of array one by one.The main difference between forEach and filter is that forEach just loop over the array and executes the callback but filter executes the callback and check its return value.Map like filter & foreach takes a callback and run it against every element on the array but whats makes it unique is it generate a new array based on your existing array.The find method is used to find all the descendant elements of the selected element. It finds the element in the DOM tree by traversing through the root to leaf.
                                </div>
                            </div>
                        </div>
                        <div class="accordion-item mt-3 border border-2 rounded rounded-1">
                            <h2 class="accordion-header" id="headingThree">
                            <button class="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                Why we use template string?
                            </button>
                            </h2>
                            <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                   Template strings allow us to use strings or embedded expressions in the form of a string. They are enclosed in backticks.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    `;
    questionAnswerContainer.appendChild(questionAnswerDiv);
})

loadCategoryDetails('01','Breaking News');
loadCategories();
let flag=0;




