FROM node:22-bookworm

# Install system dependencies (including Python for FastAPI backend)
RUN apt-get update && apt-get install -y \
  git \
  curl \
  jq \
  python3 \
  python3-pip \
  python3-venv \
  && rm -rf /var/lib/apt/lists/*

# Install GitHub CLI
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
  | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
  | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
  && apt-get update && apt-get install -y gh \
  && rm -rf /var/lib/apt/lists/*

# Build-args for UID/GID alignment
ARG AGENT_UID=1000
ARG AGENT_GID=1000

# Rename the base image's "node" user to "agent" and align UID/GID.
RUN groupmod -g $AGENT_GID node && usermod -u $AGENT_UID -g $AGENT_GID -d /home/agent -m -l agent node

# Create a virtual environment for Python (owned by agent user to avoid permission issues)
RUN python3 -m venv /opt/venv && /opt/venv/bin/pip install --upgrade pip setuptools

# Pre-install Python requirements (as root before switching user)
COPY api/requirements.txt /tmp/requirements.txt
RUN /opt/venv/bin/pip install -r /tmp/requirements.txt

# Install OpenCode CLI
RUN npm install -g opencode-ai@latest

# Add venv to PATH for the agent user and force English git messages
ENV PATH="/opt/venv/bin:${PATH}" LC_ALL=C

# Ensure agent user owns the venv
RUN chown -R ${AGENT_UID}:${AGENT_GID} /opt/venv

USER ${AGENT_UID}:${AGENT_GID}

WORKDIR /home/agent

ENTRYPOINT ["sleep", "infinity"]
