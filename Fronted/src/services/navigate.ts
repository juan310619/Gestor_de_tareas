export function navigate(path: string) {
  if (path === "/") {
    window.location.href = "/";
    return;
  }
  window.history.pushState(null, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}
