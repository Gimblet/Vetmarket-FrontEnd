{
  description = ".NET8 tool chain";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/release-25.05";
  };

  outputs =
    { nixpkgs
    , ...
    }@inputs:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs {
        system = system;
      };

    in

    {
      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [
          nodejs_22
          bun
        ];

        shellHook = ''
          echo "Node JS 22 with Bun Loaded"
        '';

        SHELL = "${pkgs.zsh}/bin/zsh";
      };
    };

}
