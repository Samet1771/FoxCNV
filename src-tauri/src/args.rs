//! Parse a file path handed to us on the command line.
//!
//! The Explorer right-click verb launches `FoxCNV.exe "C:\path\to\file.ext"`,
//! so we accept the first argument that points to an existing file, ignore
//! flags, and canonicalize it to an absolute path. Argument `[0]` is the
//! executable itself and is skipped.

use std::path::PathBuf;

/// Returns the first CLI argument that is an existing file, as an absolute path
/// string. `argv` is expected to include the program name at index 0.
pub fn first_file(argv: &[String]) -> Option<String> {
    let path = argv
        .iter()
        .skip(1)
        .filter(|a| !a.starts_with('-')) // ignore switches like `--flag`
        .map(PathBuf::from)
        .find(|p| p.is_file())?;

    // Prefer the canonical absolute path; fall back to the raw path if the
    // OS refuses to canonicalize for some reason.
    let resolved = std::fs::canonicalize(&path).unwrap_or(path);
    Some(resolved.to_string_lossy().into_owned())
}
