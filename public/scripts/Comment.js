// run functions asynchronously to the server and webpage, to avoid lag time while while javascript funcitons finishes loading and retrieving values
async function commentForm(event){
    event.preventDefault();

    const comment_text = document.querySelector('textarea[name="comment-text"]').value.trim();
    // convert the url address to a string seperate it at the slashes and get the last value for the post id number
    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    if(comment_text) {
        const response = await fetch ('/api/comments', {
            method: 'POST',
            body: JSON.stringify({
                post_id,
                comment_text
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if(response.ok){
            document.location.reload();
        } else {
            alert(response.statusText);
        }
    }
}

document.querySelector('.comment-form').addEventListener('submit', commentForm)