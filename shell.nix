{pkgs ? import <nixpkgs> {}}:
let
  nix-prisma-utils = builtins.getFlake "github:VanCoding/nix-prisma-utils";
  shellHook = ((nix-prisma-utils.lib.prisma-factory {
    inherit pkgs;
    prisma-fmt-hash = "sha256-x0Nf8COyg8+LR9j7EIClA6M7xW+FtYr+wY7OrCloULE=";
    query-engine-hash = "sha256-rUa1ftUwge1hiQ1F1Ey8Bdfp1nX2QGJseMLg5323M0Y=";
    libquery-engine-hash = "sha256-4jNKdaRhj9Tqeq1Fa5W20cePzlAmfEQi3Q8td21kVT0=";
    schema-engine-hash = "sha256-KccUx/ZfRZ+Xo8vDL6uYEjGR4W64L95Lx+0JeVRTXGY=";
  }).fromBunLock ./bun.lock).shellHook;
in
pkgs.mkShell {
  packages = with pkgs; [
    bun
    nodejs
  ];
  
  inherit shellHook;
}
