const products = async (role, page) => {
  if (!page) {
    page = "/api/shelf/products/";
  }
  try {
    const data = await fetch(page);
    if (!data.ok) {
      DisplayMessage("Couldn't get products. Try again", "error");
      return null;
    }

    const response = await data.json();

    if (response.count == 0) {
      DisplayMessage("No Products Available", "warning");
      return null;
    }

    const count = response.count;
    const next = response.next;
    const previous = response.previous;
    const results = response.results;

    html = ``;
    for (let product of results) {
      const categories = product.category.map((category) => category.name);
      const files = product.files.map((file) => file.file);

      cost = ``;
      cost_float = parseFloat(product.cost_price).toFixed(2);
      selling_float = parseFloat(product.selling_price).toFixed(2);

      if (role === "admin") {
        cost += `<li class="flex items-center gap-2">
                    <svg class="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8 7V6c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1h-1M3 18v-7c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                    </svg>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">${cost_float}</p>
                  </li>`;
      }

      image = files[0];

      let preview_images = files.length
        ? `
            <div class="p-2 w-auto bg-gray-100 rounded-lg dark:bg-gray-700">
                <img src="${files[0]}" alt="${product.name}-Image">
            </div>
            `
        : "";

      for (let img_file of files.slice(1)) {
        preview_images += `
                    <div class="p-2 w-auto bg-gray-100 rounded-lg dark:bg-gray-700">
                        <img src="${img_file}" alt="${product.name}-Image">
                    </div>`;
      }

      let category = ``;
      if (categories) {
        category += `<span class="me-2 rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300"> ${categories[0]} </span>`;
        if (categories.length > 1) {
          category += `<span class="me-2 rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300"> ${categories[1]} </span>`;
        }
      }

      let all_categories = category;
      for (let category in categories.slice(2)) {
        all_categories += `<span class="me-2 rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">${category}</span>`;
      }

      let dimension = `<div class="p-3 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
            <dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Dimensions (cm)</dt>
            <dd class="text-gray-500 dark:text-gray-400">`;

      let product_weight = "";

      dimension += product.height ? product.height : "";
      dimension += product.width ? " X " + product.width : "";
      dimension += product.depth ? " X " + product.depth : "";
      dimension += `</dd>
                </div>`;
      if (!product.height || !product.width) {
        dimension = "";
      }

      if (product.weight) {
        product_weight = `
                <div class="p-3 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                    <dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Item weight (kg)</dt>
                    <dd class="text-gray-500 dark:text-gray-400">${product.weight}</dd>
                </div>`;
      }

      let update_images = product.files.length ? `
          <div class="relative p-2 bg-gray-100 rounded-lg w-fit sm:h-36 dark:bg-gray-700">
              <img src="${product.files[0].file}" class="h-full w-full" alt="${product.name}-Image">
              <button type="button" onclick="delete_image('${role}', '${product.files[0].id}', '${product.id}-image_container')"
                  class="absolute text-red-600 dark:text-red-500 hover:text-red-500 dark:hover:text-red-400 bottom-1 left-1">
                  <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  <span class="sr-only">Remove image</span>
              </button>
          </div>` : '';

      for (let img_file of product.files.slice(1)) {
          update_images += `
              <div class="relative p-2 bg-gray-100 rounded-lg sm:w-36 sm:h-36 dark:bg-gray-700">
                  <img src="${img_file.file}" class="h-full w-full" alt="${product.name}-Image">
                  <button type="button" onclick="delete_image('${role}', '${img_file.id}', '${product.id}-image_container')"
                      class="absolute text-red-600 dark:text-red-500 hover:text-red-500 dark:hover:text-red-400 bottom-1 left-1">
                      <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                      <span class="sr-only">Remove image</span>
                  </button>
              </div>`
      }

      let preview_cost = ``;
      let preview_update = "";
      let update_modal = "";
      let preview_delete = "";
      let delete_modal = "";
      if (role == "admin") {
        preview_cost = ` 
                      <div class="p-3 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                            <dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Cost Price</dt>
                            <dd class="text-gray-500 dark:text-gray-400">
                                #${product.cost_price}
                            </dd>
                        </div>`;
        preview_update = `
            <button type="button" data-drawer-target="update-product-${product.id}" data-drawer-show="update-product-${product.id}"
                    aria-controls="update-product-${product.id}" class="text-white w-full inline-flex items-center justify-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    <svg aria-hidden="true" class="mr-1 -ml-1 w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
                    </svg>
                    Edit
            </button>`;

        update_modal = `
            <form action="#" id="update-product-${product.id}" class="fixed top-0 left-0 z-50 w-full h-screen max-w-3xl p-4 overflow-y-auto transition-transform -translate-x-full bg-white dark:bg-gray-800" tabindex="-1" aria-labelledby="update-product-${product.id}-label" aria-hidden="true">
                <h5 id="drawer-label" class="inline-flex items-center mb-6 text-sm font-semibold text-gray-500 uppercase dark:text-gray-400">Edit Product</h5>
                <button type="button" data-drawer-dismiss="update-product-${product.id}" aria-controls="update-product-${product.id}" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                    <span class="sr-only">Close menu</span>
                </button>
                <div class="grid gap-4 sm:grid-cols-3 sm:gap-6 ">
                    <div class="space-y-4 sm:col-span-2 sm:space-y-6">
                        <div>
                            <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Name</label>
                            <input type="text" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                            value="${product.name}" placeholder="Type product name" required="">
                        </div>
                        <div>
                            <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                            <div class="w-full border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                                <div class="flex items-center justify-between px-3 py-2 border-b dark:border-gray-600">
                                    <div class="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-600">
                                        <div class="flex items-center space-x-1 sm:pr-4">
                                            <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clip-rule="evenodd" />
                                                </svg>
                                                <span class="sr-only">Attach file</span>
                                            </button>
                                            <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                                                </svg>
                                                <span class="sr-only">Embed map</span>
                                            </button>
                                            <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                                                </svg>
                                                <span class="sr-only">Upload image</span>
                                            </button>
                                            <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                                                </svg>
                                                <span class="sr-only">Format code</span>
                                            </button>
                                            <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clip-rule="evenodd" />
                                                </svg>
                                                <span class="sr-only">Add emoji</span>
                                            </button>
                                        </div>
                                        <div class="flex-wrap items-center hidden space-x-1 sm:flex sm:pl-4">
                                            <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                                                </svg>
                                                <span class="sr-only">Add list</span>
                                            </button>
                                            <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                                                </svg>
                                                <span class="sr-only">Settings</span>
                                            </button>
                                        </div>
                                    </div>
                                    <button type="button" data-tooltip-target="tooltip-fullscreen" class="p-2 text-gray-500 rounded cursor-pointer sm:ml-auto hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clip-rule="evenodd" />
                                        </svg>
                                        <span class="sr-only">Full screen</span>
                                    </button>
                                    <div id="tooltip-fullscreen" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700" data-popper-reference-hidden="" data-popper-escaped="" data-popper-placement="bottom" style="position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate3d(0px, 335px, 0px);">
                                        Show full screen
                                        <div class="tooltip-arrow" data-popper-arrow=""></div>
                                    </div>
                                </div>
                                <div class="px-4 py-3 bg-white rounded-b-lg dark:bg-gray-800">
                                    <textarea id="description" rows="8" class="block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" 
                                        placeholder="Write product description here" required="">${product.description}</textarea>
                                </div>
                            </div>
                        </div>
                        <div class="mb-4">
                            <span class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Images</span>
                            <div id="${product.id}-image_container" class="grid grid-cols-3 gap-4 mb-4">
                                ${update_images}
                            </div>
                            <div class="flex items-center justify-center w-full">
                                <label for="update-${product.id}-dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg aria-hidden="true" class="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span class="font-semibold">Click to upload</span>
                                            or drag and drop
                                        </p>
                                        <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                    </div>
                                    <input id="update-${product.id}-dropzone-file" onchange="select_image(event, 'update-${product.id}-selected-images')" type="file" class="hidden" multiple>
                                    <div id="update-${product.id}-selected-images" class="flex flex-wrap justify-center space-x-2 items-center w-full">
                                        <p class="text-sm text-gray-500 dark:text-gray-400">Selected files will appear here</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="space-y-4 sm:space-y-6">
                        <div>
                            <label for="product-brand" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Brand</label>
                            <input type="text" id="product-brand" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value="Apple" placeholder="Product Brand" required="">
                        </div>
                        <div>
                            <label for="category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                            <select id="category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                <option selected="">Electronics</option>
                                <option value="TV">TV/Monitors</option>
                                <option value="PC">PC</option>
                                <option value="GA">Gaming/Console</option>
                                <option value="PH">Phones</option>
                            </select>
                        </div>
                        <div>
                            <label for="item-weight" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Item Weight (kg)</label>
                            <input type="number" step="0.01" name="item-weight" id="item-weight" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value="12" placeholder="Ex. 12" required="">
                        </div>
                        <div>
                            <label for="length" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Length (cm)</label>
                            <input type="number" step="0.01" name="length" id="lenght" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value="105" placeholder="Ex. 105" required="">
                        </div>
                        <div>
                            <label for="breadth" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Breadth (cm)</label>
                            <input type="number" step="0.01" name="breadth" id="breadth" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value="15" placeholder="Ex. 15" required="">
                        </div>
                        <div>
                            <label for="width" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Width (cm)</label>
                            <input type="number" step="0.01" name="width" id="width" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value="23" placeholder="Ex. 23" required="">
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4 mt-6 sm:w-1/2">
                    <button type="submit" class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Update product</button>
                    <button type="button" class="text-red-600 inline-flex justify-center items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                        <svg aria-hidden="true" class="w-5 h-5 mr-1 -ml-1" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                        Delete
                    </button>
                </div>
            </form>`;


        preview_delete = `
            <button type="button" data-modal-target="delete-${product.id}-modal" data-modal-toggle="delete-${product.id}-modal" 
                    class="inline-flex w-full items-center text-white justify-center bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
                    <svg aria-hidden="true" class="w-5 h-5 mr-1.5 -ml-1" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" />
                    </svg>
                    Delete
                </button>`;            
        delete_modal = `
            <!-- Delete Modal -->
            <div id="delete-${product.id}-modal" tabindex="-1" class="fixed top-0 left-0 right-0 z-50 hidden p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div class="relative w-full h-auto max-w-md max-h-full">
                    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="delete-${product.id}-modal">
                            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                            <span class="sr-only">Close modal</span>
                        </button>
                        <div class="p-6 text-center">
                            <svg aria-hidden="true" class="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200" fill="none" stroke="currentColor" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to Delete this Product?</h3>
                            <button data-modal-toggle="delete-${product.id}-modal" type="button"  onclick="adminDeleteProduct('${role}', ${product.id})"
                                class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                Yes, I'm sure
                            </button>
                            <button data-modal-toggle="delete-${product.id}-modal" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
                        </div>
                    </div>
                </div>
            </div>`;
      }

      preview_modal = `
                <!-- Preview Drawer -->
                <div id="read-product-${product.id
        }-advanced" class="overflow-y-auto fixed top-0 left-0 z-50 p-4 w-full max-w-lg h-screen bg-white transition-transform -translate-x-full dark:bg-gray-800" tabindex="-1" aria-labelledby="drawer-label" aria-hidden="true">
                    <div>
                        <h4 id="read-drawer-${product.id
        }-label" class="mb-1.5 leading-none flex w-full justify-start space-x-4 text-xl font-semibold text-gray-900 dark:text-white">
                            <span>${product.name}</span>
                            <a href="#" class="hover:underline">${product.sku.substring(
          0,
          8
        )}</a>
                        </h4>
                    </div>
                    <button type="button" data-drawer-dismiss="read-product-${product.id
        }-advanced" aria-controls="read-product-${product.id
        }-advanced" 
                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                        <span class="sr-only">Close menu</span>
                    </button>
                    <div class="grid grid-cols-3 gap-4 mb-4 sm:mb-5">
                        ${preview_images}
                    </div>
                    <dl class="sm:mb-5">
                        <dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Details</dt>
                        <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"> ${product.description
        } </dd>
                    </dl>
                    <dl class="sm:mb-5">
                        <dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Selling Quantity</dt>
                        <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">#${product.selling_price
        } For ${product.recorder_quantity} ${product.recorder_quantity_name
        }  </dd>
                    </dl>
                    <dl class="grid grid-cols-2 gap-4 mb-4">
                        ${preview_cost}
                        <div class="p-3 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                            <dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Selling Price</dt>
                            <dd class="text-gray-500 dark:text-gray-400">
                                #${product.selling_price}
                            </dd>
                        </div>

                        <div class="p-3 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                            <dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Category</dt>
                            <dd class="text-gray-500 dark:text-gray-400">
                                ${all_categories}
                            </dd>
                        </div>
                        ${dimension}
                        ${product_weight}
                    </dl>
                    <div class="flex bottom-0 left-0 justify-center pb-4 space-x-4 w-full">
                        ${preview_update}
                        ${preview_delete}
                    </div>
                </div>`;

      html += `
                <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <span id="${product.id}" class="sr-only">${product.sku}</span>
                <div class="h-56 w-full">
                    <img class="mx-auto h-full" src="${image}" alt="${product.id
        }-${product.name}" />
                </div>
                <div class="pt-6">
                  <div class="mb-4 flex items-center justify-between gap-4">
                    ${category}
                    <div class="flex items-center justify-end gap-1">
                      <button type="button" data-tooltip-target="tooltip-quick-look" class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        <span class="sr-only"> Quick look </span>
                        <svg class="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                          <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      </button>
                      <div id="tooltip-quick-look" role="tooltip" class="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700" data-popper-placement="top">
                        Quick look
                        <div class="tooltip-arrow" data-popper-arrow=""></div>
                      </div>
                    </div>
                  </div>

                  <div data-drawer-target="read-product-${product.id}-advanced" data-drawer-show="read-product-${product.id}-advanced"
                        aria-controls="read-product-${product.id}-advanced"
                      class="text-lg font-semibold flex w-full justify-between leading-tight text-gray-900 hover:underline dark:text-white">
                  <span>${product.name}</span>
                  <span class="hover:underline">${product.sku.substring(0,8)}</span>
                  </div>

                  <ul class="mt-2 flex items-center gap-4">
                    <li class="flex items-center gap-2">
                      <svg class="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
                      </svg>
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">${product.recorder_quantity} ${product.recorder_quantity_name}</p>
                    </li>
                    ${cost}
                  </ul>

                  <div class="mt-4 flex items-center justify-between gap-4">
                    <p class="text-2xl font-extrabold leading-tight text-gray-900 dark:text-white">NGN ${selling_float}</p>

                    <button type="button"
                        data-drawer-target="read-product-${product.id}-advanced" data-drawer-show="read-product-${product.id}-advanced"
                        aria-controls="read-product-${product.id}-advanced"
                        class="inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                        <svg class="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                          <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      Detail
                    </button>
                  </div>
                </div>
              </div>
                `;
      
      productModal = `${preview_modal} ${update_modal} ${delete_modal}`          
      html += productModal;
    }

    paginator = ``;
    let prev = "";
    let prev_url = previous;
    let nxt = "";
    let nxt_url = next;

    if (previous) {
      let prevRegex = /[?&]page=(\d+)/;
      let match = url.match(prevRegex);
      if (match) {
        prev = match[1];
      }
    } else {
      prev_url = null;
    }

    if (next) {
      let nxtRegex = /[?&]page=(\d+)/;
      let match = url.match(nxtRegex);
      if (match) {
        nxt = match[1];
      }
    } else {
      nxt_url = null;
    }

    paginator += `<nav class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 p-4" aria-label="Table navigation">
                  <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                      <span class="font-semibold text-gray-900 dark:text-white">${count}</span>
                      Results
                  </span>
                  <ul class="inline-flex items-stretch -space-x-px">
                      <li>
                          <div onclick="load_products('${role || null
      }', '${prev_url}')" class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                              <span class="sr-only">Previous</span>
                              <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                              </svg>
                          </div>
                      </li>
                      <li>
                          <div onclick="load_products('${role || null
      }', '${prev_url}')" class="flex items-center justify-center h-full text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">${prev}</div>
                      </li>
                      <li>
                          <div onclick="load_products('${role || null
      }', '${nxt_url}')" class="flex items-center justify-center h-full text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">${nxt}</div>
                      </li>
                      <li>
                          <div onclick="load_products('${role || null
      }', '${nxt_url}')" class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                              <span class="sr-only">Next</span>
                              <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                              </svg>
                          </div>
                      </li>
                  </ul>
              </nav>`;

    return { html, count, next, previous, results, paginator };
  } catch (error) {
    DisplayMessage(`An error occurred ${error}`, "error");
    return null;
  }
};

/* const categories = async () => {
    try {
      const data = await fetch("/api/shelf/categories/")
      if (!data.ok) {
        DisplayMessage("No Category Registered", "error");
        return "";
      }

      let response = await data.json();
      if (!response.results) {
        DisplayMessage("No Category Registered", "error");
        return "";
      }

      const count = response.count;
      const next = response.next;
      const previous = response.previous;
      const results = response.results;

      html = ``;
      results.forEach((category) => {
        html += `
            <li class="flex items
            `;
      });
      return html, count, next, previous, results;

    }catch(error){
      console.error("Error:", error);
      DisplayMessage("An error occurred", "error");
      return;
    };
}; */

let debounceProductTimeout;
const debounceGetProduct = (search_input, role) => {
  clearTimeout(debounceProductTimeout);
  debounceProductTimeout = setTimeout(
    () => getProduct(search_input, role),
    1000
  );
};
const getProduct = async (search_input, role) => {
  const input_value = search_input.value;

  if (input_value.length >= 3) {
    // search for the item
    load_products(role, `/api/shelf/products/?search=${input_value}`);
  } else {
    // load the normal page if input length is less than 3
    load_products(role);
  }
};


const createProduct = async () => {
  const name = document.getElementById("create_name").value;
  const category_list = document.getElementById("category_checkbox_list");
  const cost_price = document.getElementById("create_cost_price").value;
  const selling_price = document.getElementById("create_selling_price").value;
  const weight = document.getElementById("create_weight").value;
  const height = document.getElementById("create_height").value;
  const width = document.getElementById("create_width").value;
  const description = document.getElementById("create_description").value;
  const recorder_quantity = document.getElementById(
    "create_recorder_quantity"
  ).value;
  const recorder_quantity_name = document.getElementById(
    "create_recorder_quantity_name"
  ).value;
  const file_input = document.getElementById("create-dropzone-file").files;

  const top_msg = document.getElementById("top_error");
  const bottom_msg = document.getElementById("bottom_error");

  top_msg.innerHTML = "";
  bottom_msg.innerHTML = "";
  top_msg.classList.remove("hidden");
  bottom_msg.classList.remove("hidden");

  if (!name || !selling_price) {
    let message = DisplayMessage("Name and Price required", "error");
    top_msg.innerHTML = message.outerHTML;
    bottom_msg.innerHTML = message.outerHTML;

    setTimeout(() => {
      top_msg.classList.add("hidden");
      bottom_msg.classList.add("hidden");
    }, 4000);
    return;
  }

  let categories = category_list.querySelectorAll(
    "input[type='checkbox']:checked"
  );
  if (categories.length == 0) {
    let message = DisplayMessage("Select at least one category", "error");

    top_msg.innerHTML = message.outerHTML;
    bottom_msg.innerHTML = message.outerHTML;

    setTimeout(() => {
      top_msg.classList.add("hidden");
      bottom_msg.classList.add("hidden");
    }, 4000);
    return;
  }

  let category_ids = [];
  for (category of categories) {
    category_ids.push(category.value);
  }

  let product_data = {
    name: name,
    category: category_ids,
    cost_price: cost_price,
    selling_price: selling_price,
    weight: weight,
    height: height,
    width: width,
    description: description,
    files: file_input,
  };

  if (recorder_quantity && recorder_quantity != 0) {
    product_data.recorder_quantity = recorder_quantity;
    product_data.recorder_quantity_name = recorder_quantity_name;
  }

  let request_data = {
    name: product_data.name,
    description: product_data.description
      ? product_data.description != ""
        ? product_data.description
        : null
      : null,
    cost_price: product_data.cost_price,
    selling_price: product_data.selling_price,
    category_ids: product_data.category,
    weight: product_data.weight
      ? product_data.weight != ""
        ? product_data.weight
        : null
      : null,
    height: product_data.width
      ? product_data.width != ""
        ? product_data.width
        : null
      : null,
    width: product_data.length
      ? product_data.length != ""
        ? product_data.length
        : null
      : null,
  };

  if (
    product_data.recorder_quantity &&
    parseInt(product_data.recorder_quantity) >= 1
  ) {
    request_data.recorder_quantity = product_data.recorder_quantity;
    request_data.recorder_quantity_name = product_data.recorder_quantity_name;
  }

  try {
    const response = await fetch("/api/shelf/products/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify(request_data),
    });

    if (!response.ok) {
      let message = DisplayMessage("Couldn't create product", "error");

      top_msg.innerHTML = message.outerHTML;
      bottom_msg.innerHTML = message.outerHTML;

      setTimeout(() => {
        top_msg.classList.add("hidden");
        bottom_msg.classList.add("hidden");
      }, 4000);
      return;
    }

    const data = await response.json();
    if (!data) {
      let message = DisplayMessage("Couldn't create product", "error");

      top_msg.innerHTML = message.outerHTML;
      bottom_msg.innerHTML = message.outerHTML;

      setTimeout(() => {
        top_msg.classList.add("hidden");
        bottom_msg.classList.add("hidden");
      }, 4000);
      return;
    }

    if (product_data.files) {
      for (file of product_data.files) {
        try {
          let file_form = new FormData();
          file_form.append("product", data.id);
          file_form.append("file", file);

          await fetch("/api/shelf/product-files/", {
            method: "POST",
            headers: {
              "X-CSRFToken": getCookie("csrftoken"),
            },
            body: file_form,
          });
        } catch {
          continue;
        }
      }
    }

    let modal_btn = document.getElementById("close_create_modal");
    modal_btn.click();

    DisplayMessage("Product created successfully", "success");

    top_msg.innerHTML = "";
    bottom_msg.innerHTML = "";
    top_msg.classList.add("hidden");
    bottom_msg.classList.add("hidden");

    load_products("admin");
  } catch (error) {
    let message = DisplayMessage("Couldn't create product", "error");

    top_msg.innerHTML = message.outerHTML;
    bottom_msg.innerHTML = message.outerHTML;

    setTimeout(() => {
      top_msg.classList.add("hidden");
      bottom_msg.classList.add("hidden");
    }, 4000);
    return;
  }
};
const adminDeleteProduct = async (role, product_id) => {
  try {
    const response = await fetch(`/api/shelf/products/${product_id}/`)
    if (!response.ok) {
      DisplayMessage("Couldn't identify product", "error")
      return
    }

    const data = await response.json()

    await fetch(`/api/shelf/products/${data.product}/`, {
      method: "DELETE",
      headers: {
        'X-CSRFToken': getCookie('csrftoken')
      }
    })

    console.log("deleting")
    load_product(role)


  } catch (error) {
    DisplayMessage("Couldn't identify product", "error")
    return;
  }
}



const load_products = async (role, page) => {
  let categories = "";
  let order = "";

  let sorting = "";
  let response;

  try {
    if (page && page != "") {
      response = await products(role, page + sorting);
    } else {
      response = await products(role, "/api/shelf/products" + sorting);
    }

    if (!response) {
      DisplayMessage("An error occurred", "error");
      return;
    }

    let html = "";
    let results = "";
    let paginator = "";

    if (response && response.html) {
      html = response.html;
      paginator = response.paginator;
    }

    const product_section = document.getElementById("product_section");
    const pagination_section = document.getElementById("product_pagination");
    product_section.innerHTML = html;
    pagination_section.innerHTML = paginator;

    initializeFlowbite();
  } catch {
    return;
  }
};


const get_category = async () => {
  let category_list = "";
  try {
    const response = await fetch("/api/shelf/categories/");
    if (!response.ok) {
      return `
              <li>
                  <div class="flex items-center">
                  No category found 
                  </div>
              </li>`;
    }

    const data = await response.json();
    if (!data || !data.results) {
      return `
              <li>
                  <div class="flex items-center">
                  No category found
                  </div>
              </li>`;
    }

    let categories = data.results;

    if (categories.length == 0) {
      return `
              <li>
                  <div class="flex items-center">
                  No category found
                  </div>
              </li>`;
    }
    category_list += `
                  <li>
                      <div class="flex items-center">
                      <input id="checkbox-item-${categories[0].id}" type="checkbox" value="${categories[0].id}" checked class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                      <label for="checkbox-item-${categories[0].id}" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">${categories[0].name}</label>
                      </div>
                  </li>`;

    for (const category of categories.slice(1)) {
      category_list += `
                  <li>
                      <div class="flex items-center">
                      <input id="checkbox-item-${category.id}" type="checkbox" value="${category.id}" class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                      <label for="checkbox-item-${category.id}" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">${category.name}</label>
                      </div>
                  </li>`;
    }
    return category_list;
  } catch (error) {
    return `
      <li>
          <div class="flex items-center">
          An error occured
          </div>
      </li>`;
  }
};

const create_category = async () => {
  const top_msg = document.getElementById("top_error");
  const bottom_msg = document.getElementById("bottom_error");

  top_msg.innerHTML = "";
  bottom_msg.innerHTML = "";
  top_msg.classList.remove("hidden");
  bottom_msg.classList.remove("hidden");

  let category_name = document.getElementById("new_category").value;
  let category_list = document.getElementById("category_checkbox_list");

  if (!category_name) {
    let message = DisplayMessage("Category name required", "error");
    top_msg.innerHTML = message.outerHTML;
    bottom_msg.innerHTML = message.outerHTML;

    setTimeout(() => {
      top_msg.classList.add("hidden");
      bottom_msg.classList.add("hidden");
    }, 4000);
    return null;
  }
  try {
    const response = await fetch("/api/shelf/categories/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({ name: category_name }),
    });

    if (!response.ok) {
      let message = DisplayMessage("Something Went Wrong 1", "error");
      top_msg.innerHTML = message.outerHTML;
      bottom_msg.innerHTML = message.outerHTML;

      setTimeout(() => {
        top_msg.classList.add("hidden");
        bottom_msg.classList.add("hidden");
      }, 4000);
      return null;
    }

    const data = await response.json();
    if (!data) {
      let message = DisplayMessage("Something Went Wrong 2", "error");
      top_msg.innerHTML = message.outerHTML;
      bottom_msg.innerHTML = message.outerHTML;

      setTimeout(() => {
        top_msg.classList.add("hidden");
        bottom_msg.classList.add("hidden");
      }, 4000);
      return null;
    }

    let category_item = `
                  <div class="flex flex-col justify-between space-y-2">
                      <div class="relative max-w-fit">
                          <input type="text" id="input-category-search" oninput="debounceSearchCategory()"
                          class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                          placeholder="Search Category">
                      </div>
                      <div class="flex md:justify-between md:items-center md:flex-row flex-col justify-center items-center space-x-0 space-y-1 md:space-y-0 md:space-x-4">
                          <input type="text" id="new_category"
                              class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                              placeholder="New Category">
                          <button type="button" id="createCategoryButton" onclick="create_category()"
                          class="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                              Create
                          </button>
                      </div>
                  </div>`;
    category_list.innerHTML = category_item;

    let categories = await get_category();
    category_list.innerHTML += categories;

    return data;
  } catch (error) {
    let message = DisplayMessage("Something Went Wrong 3", "error");
    top_msg.innerHTML = message.outerHTML;
    bottom_msg.innerHTML = message.outerHTML;

    setTimeout(() => {
      top_msg.classList.add("hidden");
      bottom_msg.classList.add("hidden");
    }, 4000);
    return null;
  }
};


let debounceCategoryTimeout;
const debounceSearchCategory = (search_modal) => {
  clearTimeout(debounceCategoryTimeout);
  debounceCategoryTimeout = setTimeout(
    () => search_category(search_modal),
    1000
  );
};
const search_category = async (search_modal) => {
  const category_list = document.getElementById(`category_checkbox_list`);
  const category_name = document.getElementById(`input-category-search`).value;

  const top_msg = document.getElementById("top_error");
  const bottom_msg = document.getElementById("bottom_error");

  top_msg.innerHTML = "";
  bottom_msg.innerHTML = "";
  top_msg.classList.remove("hidden");
  bottom_msg.classList.remove("hidden");

  if (category_name.length >= 3) {
    try {
      const response = await fetch(
        `/api/shelf/categories/?search=${category_name}`
      );
      if (!response.ok) {
        let message = DisplayMessage("An error occurred", "error");
        top_msg.innerHTML = message.outerHTML;
        bottom_msg.innerHTML = message.outerHTML;

        setTimeout(() => {
          top_msg.classList.add("hidden");
          bottom_msg.classList.add("hidden");
        }, 4000);
        return;
      }
      const data = await response.json();
      const results = data.results;

      let search_results = `
          <div class="flex flex-col justify-between space-y-2">
              <div class="relative max-w-fit">
                  <input type="text" id="input-category-search" oninput="debounceSearchCategory()"
                  class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                  placeholder="Search Category">
              </div>
              <div class="flex md:justify-between md:items-center md:flex-row flex-col justify-center items-center space-x-0 space-y-1 md:space-y-0 md:space-x-4">
                  <input type="text" id="new_category"
                      class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                      placeholder="New Category">
                  <button type="button" id="createCategoryButton" onclick="create_category()"
                  class="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                      Create
                  </button>
              </div>
          </div>
          <li>
              <div class="flex items-center">
              <input id="checkbox-item-${results[0].id}" type="checkbox" value="${results[0].id}" checked class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
              <label for="checkbox-item-${results[0].id}" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">${results[0].name}</label>
              </div>
          </li>`;

      for (category of results.slice(1)) {
        search_results += `
          <li>
              <div class="flex items-center">
              <input id="checkbox-item-${category.id}" type="checkbox" value="${category.id}" class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
              <label for="checkbox-item-${category.id}" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">${category.name}</label>
              </div>
          </li>`;
      }

      category_list.innerHTML = search_results;
    } catch (error) {
      let categories = await get_category();
      category_list.innerHTML = `
      <div class="flex flex-col justify-between space-y-2">
              <div class="relative max-w-fit">
                  <input type="text" id="input-category-search" oninput="debounceSearchCategory()"
                  class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                  placeholder="Search Category">
              </div>
              <div class="flex md:justify-between md:items-center md:flex-row flex-col justify-center items-center space-x-0 space-y-1 md:space-y-0 md:space-x-4">
                  <input type="text" id="new_category"
                      class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                      placeholder="New Category">
                  <button type="button" id="createCategoryButton" onclick="create_category()"
                  class="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                      Create
                  </button>
              </div>
          </div>`;
      category_list.innerHTML += categories;
    }
  } else {
    let categories = await get_category();
    category_list.innerHTML = `
      <div class="flex flex-col justify-between space-y-2">
              <div class="relative max-w-fit">
                  <input type="text" id="input-category-search" oninput="debounceSearchCategory()"
                  class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                  placeholder="Search Category">
              </div>
              <div class="flex md:justify-between md:items-center md:flex-row flex-col justify-center items-center space-x-0 space-y-1 md:space-y-0 md:space-x-4">
                  <input type="text" id="new_category"
                      class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                      placeholder="New Category">
                  <button type="button" id="createCategoryButton" onclick="create_category()"
                  class="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                      Create
                  </button>
              </div>
          </div>`;
    category_list.innerHTML += categories;
  }
};

const select_image = async (event, img_container) => {
  const fileInput = event.target;
  const selectedImagesContainer = document.getElementById(img_container);

  // Clear previous content
  selectedImagesContainer.innerHTML = "";

  const files = fileInput.files;
  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const fileName = files[i].name;
      const fileItem = document.createElement("p");
      fileItem.className = "text-sm text-gray-500 dark:text-gray-400";
      fileItem.textContent = fileName;
      selectedImagesContainer.appendChild(fileItem);
      console.log("uploaded");
    }
  } else {
    const noFilesMessage = document.createElement("p");
    noFilesMessage.className = "text-sm text-gray-500 dark:text-gray-400";
    noFilesMessage.textContent = "No files selected";
    selectedImagesContainer.appendChild(noFilesMessage);
  }
};

const delete_image = async (role, img_id, image_container) => {
  if (role != "admin") {
    DisplayMessage("Unauthorised to perform this action", "error");
    return;
  }

  try {
    const response = await fetch(`/api/shelf/product-files/${img_id}/`);
    if (!response.ok) {
      DisplayMessage("Image not found", "error");
      return;
    }

    const data = await response.json();

    await fetch(`/api/shelf/product-files/${img_id}/`, {
      method: "DELETE",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
    });

    const product_response = await fetch(
      `/api/shelf/products/${data.product}/`
    );
    if (!product_response.ok) {
      return;
    }
    const product_data = await product_response.json();

    let product_files = product_data.files.map((file) => file.file);
    const imageContainer = document.getElementById(image_container);

    imageContainer.innerHTML = product_files.length
      ? `
      <div class="relative p-2 bg-gray-100 rounded-lg w-fit sm:h-36 dark:bg-gray-700">
          <img src="${product_files[0]}" class="h-full w-full" alt="${product_data.name}-Image">
          <button type="button" class="absolute text-red-600 dark:text-red-500 hover:text-red-500 dark:hover:text-red-400 bottom-1 left-1">
              <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <span class="sr-only">Remove image</span>
          </button>
      </div>`
      : "";

    for (let file of product_files.slice(1)) {
      imageContainer.innerHTML += `
              <div class="relative p-2 bg-gray-100 rounded-lg w-fit sm:h-36 dark:bg-gray-700">
                  <img src="${file}" class="h-full w-full" alt="${product_data.name}-Image">
                  <button type="button" class="absolute text-red-600 dark:text-red-500 hover:text-red-500 dark:hover:text-red-400 bottom-1 left-1">
                      <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                      <span class="sr-only">Remove image</span>
                  </button>
              </div>`;
    }
  } catch (error) {
    DisplayMessage("Something went wrong 4", "error");
    return;
  }
};

async function ProductPage(role) {
  const response = await products(role);

  let html = "";
  let paginator = "";

  if (response && response.html) {
    html = response.html;
    paginator = response.paginator;
  }

  const categories = await get_category()

  let add_product_btn =
    role == "admin"
      ? `
        <button type="button" id="createProductButton" data-modal-target="createProductModal" data-modal-toggle="createProductModal" class="flex items-center w-full md:w-fit justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
            <svg class="h-3.5 w-3.5 mr-1.5 -ml-1" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path clip-rule="evenodd" fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
            </svg>
            New product
        </button>`
      : ``;

  let add_product_modal =
    role == "admin"
      ? `
        <!-- End block -->
        <div id="createProductModal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] md:h-full">
            <div class="relative p-4 w-full max-w-3xl h-full md:h-auto">
                <!-- Modal content -->
                <div class="relative p-4 overflow-y-auto h-[95vh] bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                    <!-- Modal header -->
                    <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Add Product</h3>
                        <button id="close_create_modal" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="createProductModal">
                            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                            <span class="sr-only">Close modal</span>
                        </button>
                    </div>
                    <!-- Modal body -->
                    <div>
                        <div class="grid gap-4 mb-4 sm:grid-cols-2">
                            <div id="top_error" class="sm:col-span-2">
                                
                            </div>
                            <div>
                                <label for="create_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Name</label>
                                <input type="text" name="create_name" id="create_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type product name" required="">
                            </div>
                            <div>
                                <label for="category_checkbox_button" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                                <button id="category_checkbox_button" data-dropdown-toggle="category_checkbox" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 flex justify-between w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" type="button">
                                    Select category
                                    <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                                    </svg>
                                </button>

                                <!-- Dropdown menu -->
                                <div id="category_checkbox" class="z-10 hidden w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                                    
                                    <ul id="category_checkbox_list" class="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="category_checkbox_button">
                                        <div class="flex flex-col justify-between space-y-2">
                                            <div class="relative max-w-fit">
                                                <input type="text" id="input-category-search" oninput="debounceSearchCategory()"
                                                class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                                                placeholder="Search Category">
                                            </div>
                                            <div class="flex md:justify-between md:items-center md:flex-row flex-col justify-center items-center space-x-0 space-y-1 md:space-y-0 md:space-x-4">
                                                <input type="text" id="new_category"
                                                    class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                                                    placeholder="New Category">
                                                <button type="button" id="createCategoryButton" onclick="create_category()"
                                                class="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                                                    Create
                                                </button>
                                            </div>
                                        </div>
                                        ${categories}
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <label for="create_cost_price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cost Price</label>
                                <input type="number" name="create_cost_price" id="create_cost_price" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="#2000" required="">
                            </div>
                            <div>
                                <label for="create_selling_price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Selling Price</label>
                                <input type="number" name="create_selling_price" id="create_selling_price" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="#3000" required="">
                            </div>
                            <div class="grid gap-4 sm:col-span-2 md:gap-6 sm:grid-cols-3">
                                <div>
                                    <label for="create_weight" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product weight (kg)</label>
                                    <input type="number" step="0.01" name="create_weight" id="create_weight" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="12">
                                </div>
                                <div>
                                    <label for="create_height" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Height (cm)</label>
                                    <input type="number" step="0.01" name="create_height" id="create_height" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="15">
                                </div>
                                <div>
                                    <label for="create_width" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Width (cm)</label>
                                    <input type="number" step="0.01" name="create_width" id="create_width" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="23">
                                </div>
                            </div>

                            <div>
                                <label for="create_recorder_quantity" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quantity per Price</label>
                                <input type="number" step="0.01" name="create_recorder_quantity" id="create_recorder_quantity" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="23">
                            </div>
                            <div>
                                <label for="create_recorder_quantity_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Per Quantity Name</label>
                                <select id="create_recorder_quantity_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                    <option value="Piece" selected="">Piece</option>
                                    <option value="Pack">Pack</option>
                                    <option value="Dozen">Dozen</option>
                                    <option value="Trowser">Trowser</option>
                                    <option value="Yard">Yard</option>
                                </select>
                            </div>

                            <div class="sm:col-span-2">
                                <label for="create_description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                <textarea id="create_description" rows="4" 
                                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                                    placeholder="Write product description here"></textarea>
                            </div>
                        </div>
                        <div class="mb-4">
                            <span class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Images</span>
                            <div class="flex justify-center items-center w-full">
                                <label for="create-dropzone-file" class="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                    <div class="flex flex-col justify-center items-center pt-5 pb-6">
                                        <svg aria-hidden="true" class="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span class="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                    </div>
                                    <input id="create-dropzone-file" onchange="select_image(event, 'create-selected-images')" type="file" class="hidden" multiple>
                                    <div id="create-selected-images" class="flex flex-wrap justify-center space-x-2 items-center w-full">
                                        <p class="text-sm text-gray-500 dark:text-gray-400">Selected files will appear here</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div id="bottom_error" class="sm:col-span-2">
                            
                        </div>
                        <div class="items-center justify-evenly space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
                            <button type="submit" onclick="createProduct()"
                                class="w-full sm:w-auto justify-center text-white inline-flex bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                Add product
                            </button>
                            <button data-modal-toggle="createProductModal" type="button" class="w-full justify-center sm:w-auto text-gray-500 inline-flex items-center bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                                <svg class="mr-1 -ml-1 w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                                Discard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
      : ``;

  return `<section class="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">
      <div class="mx-auto max-w-screen-xl">
        <!-- Heading & Filters -->
        <div class="justify-between space-y-4 sm:flex sm:space-y-0 md:mb-8">
          <div>
            <nav class="flex" aria-label="Breadcrumb">
              <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li class="inline-flex items-center">
                  <div onclick="LoadTab('general')"
                  class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white">
                    <svg class="me-2.5 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                    Home
                  </div>
                </li>
                <li>
                  <div onclick="LoadTab('products')" class="flex items-center">
                    <svg class="h-5 w-5 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" />
                    </svg>
                    <a href="#" class="ms-1 text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white md:ms-2">Products</a>
                  </div>
                </li>
              </ol>
            </nav>
            <div class="flex flex-col space-y-4 md:space-y-0 md:space-x-4 items-end md:flex-row">
                <div class="flex flex-col w-full md:w-fit justify-end items-end">
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Products</h2>
                  <div class="flex items-end h-fit w-full md:w-fit">
                      <label for="simple-search" class="sr-only">Search</label>
                      <div class="relative w-full">
                          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                              </svg>
                          </div>
                          <input type="text" id="simple-search" placeholder="Search for products" required="" oninput="debounceGetProduct(this, '${role}')"
                              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                      </div>
                  </div>
                </div>
                <div class="flex items-end h-fit w-full md:w-fit">
                  ${add_product_btn}
                </div>
            </div>
          </div>
          <div class="flex items-end space-x-4">
              <button data-modal-toggle="product-filterModal" data-modal-target="product-filterModal" type="button" class="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto">
                <svg class="-ms-0.5 me-2 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M18.796 4H5.204a1 1 0 0 0-.753 1.659l5.302 6.058a1 1 0 0 1 .247.659v4.874a.5.5 0 0 0 .2.4l3 2.25a.5.5 0 0 0 .8-.4v-7.124a1 1 0 0 1 .247-.659l5.302-6.059c.566-.646.106-1.658-.753-1.658Z" />
                </svg>
                Filters
                <svg class="-me-0.5 ms-2 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
                </svg>
              </button>
              <button id="product-sortDropdownButton1" data-dropdown-toggle="product-dropdownSort1" type="button" class="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto">
                <svg class="-ms-0.5 me-2 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M7 4l3 3M7 4 4 7m9-3h6l-6 6h6m-6.5 10 3.5-7 3.5 7M14 18h4" />
                </svg>
                Sort
                <svg class="-me-0.5 ms-2 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
                </svg>
              </button>
            <div id="product-dropdownSort1" class="z-50 hidden w-40 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700" data-popper-placement="bottom">
              <ul class="p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400" aria-labelledby="product-sortDropdownButton">
                <li>
                  <a href="#" class="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"> The most popular </a>
                </li>
                <li>
                  <a href="#" class="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"> Newest </a>
                </li>
                <li>
                  <a href="#" class="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"> Increasing price </a>
                </li>
                <li>
                  <a href="#" class="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"> Decreasing price </a>
                </li>
                <li>
                  <a href="#" class="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"> No. reviews </a>
                </li>
                <li>
                  <a href="#" class="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"> Discount % </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div id="product_section" class="mb-4 grid gap-4 h-[60vh] overflow-y-auto sm:grid-cols-2 md:mb-8 lg:grid-cols-3 2xl:grid-cols-4">
          ${html}
        </div>

        <div id="product_pagination">
          ${paginator}
        </div>
      </div>
      ${add_product_modal}
      <!-- Filter modal -->
      <form action="#" method="get" id="product-filterModal" tabindex="-1" aria-hidden="true" class="fixed left-0 right-0 top-0 z-50 hidden h-modal w-full overflow-y-auto overflow-x-hidden p-4 md:inset-0 md:h-full">
        <div class="relative h-full w-full max-w-xl md:h-auto">
          <!-- Modal content -->
          <div class="relative rounded-lg bg-white shadow dark:bg-gray-800">
            <!-- Modal header -->
            <div class="flex items-start justify-between rounded-t p-4 md:p-5">
              <h3 class="text-lg font-normal text-gray-500 dark:text-gray-400">Filters</h3>
              <button type="button" class="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="product-filterModal">
                <svg class="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
            </div>
            <!-- Modal body -->
            <div class="px-4 md:px-5">
              <div class="mb-4 border-b border-gray-200 dark:border-gray-700">
                <ul class="-mb-px flex flex-wrap text-center text-sm font-medium" id="myTab" data-tabs-toggle="#myTabContent" role="tablist">
                  <li class="mr-1" role="presentation">
                    <button class="inline-block pb-2 pr-1" id="brand-tab" data-tabs-target="#brand" type="button" role="tab" aria-controls="profile" aria-selected="false">Brand</button>
                  </li>
                  <li class="mr-1" role="presentation">
                    <button class="inline-block px-2 pb-2 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300" id="advanced-filers-tab" data-tabs-target="#advanced-filters" type="button" role="tab" aria-controls="advanced-filters" aria-selected="false">Advanced Filters</button>
                  </li>
                </ul>
              </div>
              <div id="myTabContent">
                <div class="grid grid-cols-2 gap-4 md:grid-cols-3" id="brand" role="tabpanel" aria-labelledby="brand-tab">
                  <div class="space-y-2">
                    <h5 class="text-lg font-medium uppercase text-black dark:text-white">A</h5>

                    <div class="flex items-center">
                      <input id="apple" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="apple" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Apple (56) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="asus" type="checkbox" value="" checked class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="asus" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Asus (97) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="acer" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="acer" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Acer (234) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="allview" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="allview" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Allview (45) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="atari" type="checkbox" value="" checked class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="asus" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Atari (176) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="amd" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="amd" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> AMD (49) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="aruba" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="aruba" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Aruba (16) </label>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <h5 class="text-lg font-medium uppercase text-black dark:text-white">B</h5>

                    <div class="flex items-center">
                      <input id="beats" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="beats" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Beats (56) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="bose" type="checkbox" value="" checked class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="bose" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Bose (97) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="benq" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="benq" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> BenQ (45) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="bosch" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="bosch" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Bosch (176) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="brother" type="checkbox" value="" checked class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="brother" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Brother (176) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="biostar" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="biostar" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Biostar (49) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="braun" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="braun" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Braun (16) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="blaupunkt" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="blaupunkt" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Blaupunkt (45) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="benq2" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="benq2" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> BenQ (23) </label>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <h5 class="text-lg font-medium uppercase text-black dark:text-white">C</h5>

                    <div class="flex items-center">
                      <input id="canon" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="canon" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Canon (49) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="cisco" type="checkbox" value="" checked class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="cisco" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Cisco (97) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="cowon" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="cowon" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Cowon (234) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="clevo" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="clevo" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Clevo (45) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="corsair" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="corsair" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Corsair (15) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="csl" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="csl" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Canon (49) </label>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <h5 class="text-lg font-medium uppercase text-black dark:text-white">D</h5>

                    <div class="flex items-center">
                      <input id="dell" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="dell" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Dell (56) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="dogfish" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="dogfish" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Dogfish (24) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="dyson" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="dyson" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Dyson (234) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="dobe" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="dobe" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Dobe (5) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="digitus" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="digitus" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Digitus (1) </label>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <h5 class="text-lg font-medium uppercase text-black dark:text-white">E</h5>

                    <div class="flex items-center">
                      <input id="emetec" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="emetec" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Emetec (56) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="extreme" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="extreme" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Extreme (10) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="elgato" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="elgato" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Elgato (234) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="emerson" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="emerson" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Emerson (45) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="emi" type="checkbox" value="" checked class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="emi" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> EMI (176) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="fugoo" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="fugoo" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Fugoo (49) </label>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <h5 class="text-lg font-medium uppercase text-black dark:text-white">F</h5>

                    <div class="flex items-center">
                      <input id="fujitsu" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="fujitsu" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Fujitsu (97) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="fitbit" type="checkbox" value="" checked class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="fitbit" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Fitbit (56) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="foxconn" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="foxconn" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Foxconn (234) </label>
                    </div>

                    <div class="flex items-center">
                      <input id="floston" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="floston" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Floston (45) </label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-4" id="advanced-filters" role="tabpanel" aria-labelledby="advanced-filters-tab">
                <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label for="min-price" class="block text-sm font-medium text-gray-900 dark:text-white"> Min Price </label>
                      <input id="min-price" type="range" min="0" max="7000" value="300" step="1" class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700" />
                    </div>

                    <div>
                      <label for="max-price" class="block text-sm font-medium text-gray-900 dark:text-white"> Max Price </label>
                      <input id="max-price" type="range" min="0" max="7000" value="3500" step="1" class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700" />
                    </div>

                    <div class="col-span-2 flex items-center justify-between space-x-2">
                      <input type="number" id="min-price-input" value="300" min="0" max="7000" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 " placeholder="" required />

                      <div class="shrink-0 text-sm font-medium dark:text-gray-300">to</div>

                      <input type="number" id="max-price-input" value="3500" min="0" max="7000" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="" required />
                    </div>
                  </div>

                  <div class="space-y-3">
                    <div>
                      <label for="min-delivery-time" class="block text-sm font-medium text-gray-900 dark:text-white"> Min Delivery Time (Days) </label>

                      <input id="min-delivery-time" type="range" min="3" max="50" value="30" step="1" class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700" />
                    </div>

                    <input type="number" id="min-delivery-time-input" value="30" min="3" max="50" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 " placeholder="" required />
                  </div>
                </div>

                <div>
                  <h6 class="mb-2 text-sm font-medium text-black dark:text-white">Condition</h6>

                  <ul class="flex w-full items-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                    <li class="w-full border-r border-gray-200 dark:border-gray-600">
                      <div class="flex items-center pl-3">
                        <input id="condition-all" type="radio" value="" name="list-radio" checked class="h-4 w-4 border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-primary-600" />
                        <label for="condition-all" class="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"> All </label>
                      </div>
                    </li>
                    <li class="w-full border-r border-gray-200 dark:border-gray-600">
                      <div class="flex items-center pl-3">
                        <input id="condition-new" type="radio" value="" name="list-radio" class="h-4 w-4 border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-primary-600" />
                        <label for="condition-new" class="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"> New </label>
                      </div>
                    </li>
                    <li class="w-full">
                      <div class="flex items-center pl-3">
                        <input id="condition-used" type="radio" value="" name="list-radio" class="h-4 w-4 border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-primary-600" />
                        <label for="condition-used" class="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"> Used </label>
                      </div>
                    </li>
                  </ul>
                </div>

                <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
                  <div>
                    <h6 class="mb-2 text-sm font-medium text-black dark:text-white">Colour</h6>
                    <div class="space-y-2">
                      <div class="flex items-center">
                        <input id="blue" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                        <label for="blue" class="ml-2 flex items-center text-sm font-medium text-gray-900 dark:text-gray-300">
                          <div class="mr-2 h-3.5 w-3.5 rounded-full bg-primary-600"></div>
                          Blue
                        </label>
                      </div>

                      <div class="flex items-center">
                        <input id="gray" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                        <label for="gray" class="ml-2 flex items-center text-sm font-medium text-gray-900 dark:text-gray-300">
                          <div class="mr-2 h-3.5 w-3.5 rounded-full bg-gray-400"></div>
                          Gray
                        </label>
                      </div>

                      <div class="flex items-center">
                        <input id="green" type="checkbox" value="" checked class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                        <label for="green" class="ml-2 flex items-center text-sm font-medium text-gray-900 dark:text-gray-300">
                          <div class="mr-2 h-3.5 w-3.5 rounded-full bg-green-400"></div>
                          Green
                        </label>
                      </div>

                      <div class="flex items-center">
                        <input id="pink" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                        <label for="pink" class="ml-2 flex items-center text-sm font-medium text-gray-900 dark:text-gray-300">
                          <div class="mr-2 h-3.5 w-3.5 rounded-full bg-pink-400"></div>
                          Pink
                        </label>
                      </div>

                      <div class="flex items-center">
                        <input id="red" type="checkbox" value="" checked class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                        <label for="red" class="ml-2 flex items-center text-sm font-medium text-gray-900 dark:text-gray-300">
                          <div class="mr-2 h-3.5 w-3.5 rounded-full bg-red-500"></div>
                          Red
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h6 class="mb-2 text-sm font-medium text-black dark:text-white">Weight</h6>

                    <div class="space-y-2">
                      <div class="flex items-center">
                        <input id="under-1-kg" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                        <label for="under-1-kg" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Under 1 kg </label>
                      </div>

                      <div class="flex items-center">
                        <input id="1-1-5-kg" type="checkbox" value="" checked class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                        <label for="1-1-5-kg" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> 1-1,5 kg </label>
                      </div>

                      <div class="flex items-center">
                        <input id="1-5-2-kg" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                        <label for="1-5-2-kg" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> 1,5-2 kg </label>
                      </div>

                      <div class="flex items-center">
                        <input id="2-5-3-kg" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                        <label for="2-5-3-kg" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> 2,5-3 kg </label>
                      </div>

                      <div class="flex items-center">
                        <input id="over-3-kg" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                        <label for="over-3-kg" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Over 3 kg </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h6 class="mb-2 text-sm font-medium text-black dark:text-white">Delivery type</h6>

                  <ul class="grid grid-cols-2 gap-4">
                    <li>
                      <input type="radio" id="delivery-usa" name="delivery" value="delivery-usa" class="peer hidden" checked />
                      <label for="delivery-usa" class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-primary-600 peer-checked:text-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-primary-500 md:p-5">
                        <div class="block">
                          <div class="w-full text-lg font-semibold">USA</div>
                          <div class="w-full">Delivery only for USA</div>
                        </div>
                      </label>
                    </li>
                    <li>
                      <input type="radio" id="delivery-europe" name="delivery" value="delivery-europe" class="peer hidden" />
                      <label for="delivery-europe" class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-primary-600 peer-checked:text-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-primary-500 md:p-5">
                        <div class="block">
                          <div class="w-full text-lg font-semibold">Europe</div>
                          <div class="w-full">Delivery only for USA</div>
                        </div>
                      </label>
                    </li>
                    <li>
                      <input type="radio" id="delivery-asia" name="delivery" value="delivery-asia" class="peer hidden" checked />
                      <label for="delivery-asia" class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-primary-600 peer-checked:text-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-primary-500 md:p-5">
                        <div class="block">
                          <div class="w-full text-lg font-semibold">Asia</div>
                          <div class="w-full">Delivery only for Asia</div>
                        </div>
                      </label>
                    </li>
                    <li>
                      <input type="radio" id="delivery-australia" name="delivery" value="delivery-australia" class="peer hidden" />
                      <label for="delivery-australia" class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-primary-600 peer-checked:text-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-primary-500 md:p-5">
                        <div class="block">
                          <div class="w-full text-lg font-semibold">Australia</div>
                          <div class="w-full">Delivery only for Australia</div>
                        </div>
                      </label>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Modal footer -->
            <div class="flex items-center space-x-4 rounded-b p-4 dark:border-gray-600 md:p-5">
              <button type="submit" class="rounded-lg bg-primary-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:ring-primary-800">Show 50 results</button>
              <button type="reset" class="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">Reset</button>
            </div>
          </div>
        </div>
      </form>

    </section>`;
}

window.ProductPage = ProductPage;
