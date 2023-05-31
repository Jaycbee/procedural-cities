
switch (location.search.match("\\?([^&]+)")?.[1]) {
    case "demo": { import("./render"); break }
    case "test": { import("./lol") }
}

