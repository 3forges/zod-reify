#!/bin/bash

echo " [$0] -----------------------"
echo " [$0] - BASH_ENV=[$BASH_ENV]"
echo " [$0] - PNPM_VERSION=[$PNPM_VERSION]"
echo " [$0] -----------------------"

# curl -fsSL https://get.pnpm.io/install.sh | sh -
curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=$PNPM_VERSION sh -
cat <<EOF >./add.on.bashrc
export PNPM_HOME="/home/circleci/.local/share/pnpm"
case ":\$PATH:" in
*":\$PNPM_HOME:"*) ;;
*) export PATH="\$PNPM_HOME:\$PATH" ;;
esac
EOF
cat ./add.on.bashrc | tee -a "$BASH_ENV"

rm ./add.on.bashrc