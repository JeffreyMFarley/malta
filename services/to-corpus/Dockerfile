# Define global args
ARG FUNCTION_DIR="/home/app/"
ARG RUNTIME_VERSION="3.9"

# --------------------------------------------------------------------------------
# Stage 1 - bundle base image + runtime

FROM python:${RUNTIME_VERSION}-slim-buster AS python-base

# Install GCC (Alpine uses musl but we compile and link dependencies with GCC)
RUN apt-get install \
    libstdc++

# --------------------------------------------------------------------------------
# Stage 2 - build function and dependencies

FROM python-base AS build-image

# Include global args in this stage of the build
ARG FUNCTION_DIR
ARG RUNTIME_VERSION

RUN mkdir -p ${FUNCTION_DIR}

# Optional – Install the function's dependencies
COPY requirements.txt /
RUN python${RUNTIME_VERSION} -m pip install -r /requirements.txt --target ${FUNCTION_DIR}

# Install Lambda Runtime Interface Client for Python
RUN python${RUNTIME_VERSION} -m pip install awslambdaric --target ${FUNCTION_DIR}

# Copy the src files
COPY src/* ${FUNCTION_DIR}

# --------------------------------------------------------------------------------
# Stage 3 - final runtime image

FROM python-base

# Include global arg in this stage of the build
ARG FUNCTION_DIR

WORKDIR ${FUNCTION_DIR}
COPY --from=build-image ${FUNCTION_DIR} ${FUNCTION_DIR}

# Make sure the spaCy English models are loaded
ENV PYTHONPATH=${FUNCTION_DIR}
RUN python -m spacy download en

# (Optional) Add Lambda Runtime Interface Emulator and use a script in the ENTRYPOINT for simpler local runs
ADD https://github.com/aws/aws-lambda-runtime-interface-emulator/releases/latest/download/aws-lambda-rie /usr/bin/aws-lambda-rie
COPY entry.sh /
RUN chmod 755 /usr/bin/aws-lambda-rie /entry.sh

ENTRYPOINT [ "/entry.sh" ]

# The command format should be:
#    1. The name of the python file (app)
#    2. The function to call (root_handler)
CMD [ "app.root_handler" ]
