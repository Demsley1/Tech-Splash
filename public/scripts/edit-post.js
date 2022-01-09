async function savePostHandler(event) {
    event.preventDefault();

    const title = document.querySelector('#edit-title').value.trim();
    const content = document.querySelector('textarea[name="edit-content"]').value.trim();
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ]

 

    if(title && content){
        const response = await fetch(`/api/posts/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                title,
                content
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if(response.ok){
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    }
}

document.querySelector('.save-post').addEventListener('click', savePostHandler)