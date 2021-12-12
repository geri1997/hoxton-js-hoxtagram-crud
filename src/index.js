// // write your code here
const state={
    images:[]
}

const postSection = document.querySelector('.image-container')

function getImages(){
    return fetch('http://localhost:3000/images')
    .then(resp=>{
        return resp.json()
    })
}
function updateStateFromServer(){
    getImages().then(images=>{
        state.images = images
        renderPosts()
    })
    
}
function createComment(comment, whereToAppend,post){
    const commentLi = document.createElement('li')
    commentLi.textContent = comment.content
    const dltBtn = document.createElement('button')
    dltBtn.textContent = 'X'
    dltBtn.addEventListener('click',e=>{
        post.comments=post.comments.filter(stateComment=>
                stateComment.id!==comment.id
            )
            renderPosts()
            deleteCommentFromServer(comment.id)
    })
    commentLi.append(dltBtn)
    whereToAppend.append(commentLi)
}

function createPost(post){
    const imageCardArticle = document.createElement("article");
    imageCardArticle.setAttribute("class", "image-card");

    const titleH2 = document.createElement("h2");
    titleH2.setAttribute("class", "title");
    titleH2.textContent = post.title;

    const postImg = document.createElement("img");
    postImg.src = post.image;
    postImg.setAttribute("class", "image");

    const likesSectionDiv = document.createElement("div");
    likesSectionDiv.setAttribute("class", "likes-section");

    const likesSpan = document.createElement("span");
    likesSpan.setAttribute("class", "likes");
    likesSpan.textContent = post.likes;

    const likeButton = document.createElement("button");
    likeButton.setAttribute("class", "like-button");
    likeButton.innerText = "♥";
    likeButton.addEventListener('click',e=>{
        post.likes++
        likesSpan.textContent = post.likes;
        fetch('http://localhost:3000/images/'+post.id,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({likes:post.likes})
        })
    })
    const dltBtn = document.createElement('button')
    dltBtn.textContent = 'X'
    dltBtn.addEventListener('click',e=>{
        state.images=state.images.filter(statePost=>
                statePost.id!==post.id
            )
            renderPosts()
            deletePostFromServer(post.id)
    })

    const commentsUl = document.createElement("ul");
    commentsUl.setAttribute("class", "comments");
    const commentForm = document.createElement('form')
    commentForm.setAttribute('class','comment-form')
    commentForm.addEventListener('submit',e=>{
        e.preventDefault()
        postCommentOnServer(commentInput.value,post.id)
        post.comments.push({content:commentInput.value,imageId:post.id})
        renderPosts()
        commentForm.reset()
    })
    const commentInput = document.createElement('input')
    commentInput.setAttribute('class','comment-input')
    commentInput.setAttribute('type','text')
    commentInput.setAttribute('name','comment')
    commentInput.setAttribute('placeholder','Add a comment...')
    const commentBtn = document.createElement('button')
    commentBtn.setAttribute('class','çomment-button')
    commentBtn.setAttribute('type','submit')
    commentBtn.textContent = 'Post'
    for(let comment of post.comments){
        createComment(comment,commentsUl,post)
    }


    imageCardArticle.append(titleH2, postImg, likesSectionDiv, commentsUl,commentForm)
    commentForm.append(commentInput,commentBtn)
    likesSectionDiv.append(likesSpan, likeButton,dltBtn);
    postSection.append(imageCardArticle)
}

function renderPosts(){

    postSection.innerHTML = ''
    for(let post of state.images){

        createPost(post)
    }

}


updateStateFromServer()
function postCommentOnServer(content,imageId){
    fetch('http://localhost:3000/comments/',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                content,
                imageId
              })
        })
}
function deletePostFromServer(postId){
    fetch('http://localhost:3000/images/'+postId,{
        method:'DELETE',
    })
}
function deleteCommentFromServer(commentId){
    fetch('http://localhost:3000/comments/'+commentId,{
        method:'DELETE',
    })
}