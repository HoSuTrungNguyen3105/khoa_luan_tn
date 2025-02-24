import HtmlDocx from "html-docx-js/dist/html-docx";

export const downloadWord = (posts) => {
  const postsHtml = `
  <html>
    <head><title>Posts</title></head>
    <body>
      <h1>Posts List</h1>
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>#</th> <!-- Column for serial number -->
            <th>Title</th>
            <th>Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${posts
            .map(
              (post, index) => `
                <tr>
                  <td>${index + 1}</td> <!-- Serial number (index + 1) -->
                  <td>${post.desc}</td>
                  <td>${
                    post.isLost
                      ? "Lost"
                      : post.isFound
                      ? "Found"
                      : "Unspecified"
                  }</td>
                  <td>${post.isApproved ? "Blocked" : "Active"}</td>
                </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </body>
  </html>
`;

  const converted = HtmlDocx.asBlob(postsHtml); // Convert HTML to Word document Blob
  const url = URL.createObjectURL(converted); // Create a URL for the Blob
  const link = document.createElement("a"); // Create a link element
  link.href = url; // Set the link href to the Blob URL
  link.download = "post.docx"; // Set the file name
  link.click(); // Trigger the download
};
