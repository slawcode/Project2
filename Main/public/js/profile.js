const newFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#project-name').value.trim();
  const needed_funding = document.querySelector('#project-funding').value.trim();
  const description = document.querySelector('#project-desc').value.trim();

  if (name && needed_funding && description) {
    const response = await fetch(`/api/projects`, {
      method: 'POST',
      body: JSON.stringify({ name, needed_funding, description }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to create project');
    }
  }
};

const delButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to delete project');
    }
  }
};

document
  .querySelector('.new-project-form')
  .addEventListener('submit', newFormHandler);

document
  .querySelector('.project-list')
  .addEventListener('click', delButtonHandler);
  
  
  // Get all the data from the user inputs
  // async function doupload(event) {
  //   event.preventDefault();
  //   const phone = document.querySelector("#phoneNumber").value.trim();
  //   const emergencyName = document.querySelector("#emergencyName").value.trim();
  //   const emergencyPhone = document.querySelector("#emergencyPhone").value.trim();
  //   const userId = document.querySelector("#userId").value;
  //   const fileInput = document.querySelector("#files");
  //   const formData = new FormData();
  
  //   if (fileInput.files.length > 0) {
  //     const fileName = fileInput.files[0].name;
  //     const fileExtension = fileName.split(".").pop().toLowerCase();
  //     const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
  //     if (allowedExtensions.indexOf(fileExtension) === -1) {
  //       alert("Please upload a valid image file.");
  //       return;
  //     }
  //     formData.append("picture", fileInput.files[0]);
  //   }
  //   formData.append("phoneNumber", phone);
  //   formData.append("emergencyName", emergencyName);
  //   formData.append("emergencyNumber", emergencyPhone);
  
  //   for (const value of formData.entries()) { console.log(value); }
  
  //   const response = await fetch(`/api/users/${userId}`, {
  //     method: "PUT",
  //     body: formData,
  //   });
  //   if (response.ok) {
  //     // document.location.reload();
  //   } else {
  //     alert("User could not be updated.");
  //   }
  // }
  
  // document.querySelector("#form").addEventListener("submit", doupload);


  // Get all the data from the user inputs
  async function doupload(event) {
    event.preventDefault();
    const phone = document.querySelector("#phoneNumber").value.trim();
    const emergencyName = document.querySelector("#emergencyName").value.trim();
    const emergencyPhone = document.querySelector("#emergencyPhone").value.trim();
    // Pulling from id=userId in 
    const userId = document.querySelector("#userId").value;
    const fileInput = document.querySelector("#files");
    const formData = new FormData();
    // Checking to see if user gave us a profile picture
    if (fileInput.files.length > 0) { 
      const fileName = fileInput.files[0].name;
      const fileExtension = fileName.split(".").pop().toLowerCase();
      const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"]; // Array of allowed file forms for profile pictures
      if (allowedExtensions.indexOf(fileExtension) === -1) {
        alert("Please upload a valid image file.");
        return; // If the user does not provide a good extension then they cannot upload a profile picture and return a custom message
      }
      // Append user information and profile picture
      formData.append("picture", fileInput.files[0]);
    }
    if (phone) formData.append("phoneNumber", phone);
    if (emergencyName) formData.append("emergencyName", emergencyName);
    if (emergencyPhone) formData.append("emergencyNumber", emergencyPhone);
  
    for (const value of formData.entries()) {
      console.log(value);
    }
  
    const response = await fetch(`/api/users/${userId}`, {
      method: "PATCH", // Instead of PUT for partial field input
      body: formData,
    });
    if (response.ok) {
      // document.location.reload();
    } else {
      alert("User could not be updated." + response.statusText); // Send alert to user that their information could not be updated
    }
  }
  
  document.querySelector("#form").addEventListener("submit", doupload); // Event listener on form