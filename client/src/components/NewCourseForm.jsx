function NewCourseForm() {
  return (
    <div className="bg-gray-100/40 min-h-screen">
      <div
        className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-3xl bg-white min-h-screen"
        data-v0-t="card"
      >
        <div className="flex flex-col p-6 space-y-0">
          <h3 className="whitespace-nowrap text-4xl font-semibold leading-none tracking-tight">
            Add New Course
          </h3>
          <p className="text-lg text-muted-foreground">
            Fill in the course details
          </p>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-6">
            <div className="grid gap-2">
              <label
                className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg"
                htmlFor="title"
              >
                Title
              </label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="title"
                placeholder="Enter the course title"
                required=""
              />
            </div>
            <div className="grid gap-2">
              <label
                className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="description"
                placeholder="Enter the course description"
                required=""
              ></textarea>
            </div>
            <div className="grid gap-2">
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg">
                Thumbnail
              </label>
              <div className="flex items-center gap-4">
                <img
                  src="/placeholder.svg"
                  width="150"
                  height="100"
                  alt="Thumbnail"
                  className="aspect-[3/2] rounded-lg overflow-hidden object-cover"
                />
                <input
                  className="flex h-10  rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  id="file"
                  type="file"
                />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="grid gap-2">
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg">
                Videos
              </label>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label
                    className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base"
                    htmlFor="video-1"
                  >
                    Video 1
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-lg file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="file"
                    type="file"
                  />
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="video-1"
                    placeholder="Enter the video title"
                    required=""
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base"
                    htmlFor="video-1"
                  >
                    Video 1
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-lg file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="file"
                    type="file"
                  />
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="video-1"
                    placeholder="Enter the video title"
                    required=""
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base"
                    htmlFor="video-1"
                  >
                    Video 1
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-lg file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="file"
                    type="file"
                  />
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="video-1"
                    placeholder="Enter the video title"
                    required=""
                  />
                </div>
                <button>add video</button>
              </div>
            </div>
            <div className="flex justify-end items-center gap-4">
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewCourseForm;
