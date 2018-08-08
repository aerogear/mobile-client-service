// +build !ignore_autogenerated

// Code generated by deepcopy-gen. DO NOT EDIT.

package v1alpha1

import (
	runtime "k8s.io/apimachinery/pkg/runtime"
)

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *MobileClient) DeepCopyInto(out *MobileClient) {
	*out = *in
	out.TypeMeta = in.TypeMeta
	in.ObjectMeta.DeepCopyInto(&out.ObjectMeta)
	out.Spec = in.Spec
	in.Status.DeepCopyInto(&out.Status)
	return
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new MobileClient.
func (in *MobileClient) DeepCopy() *MobileClient {
	if in == nil {
		return nil
	}
	out := new(MobileClient)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyObject is an autogenerated deepcopy function, copying the receiver, creating a new runtime.Object.
func (in *MobileClient) DeepCopyObject() runtime.Object {
	if c := in.DeepCopy(); c != nil {
		return c
	}
	return nil
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *MobileClientList) DeepCopyInto(out *MobileClientList) {
	*out = *in
	out.TypeMeta = in.TypeMeta
	out.ListMeta = in.ListMeta
	if in.Items != nil {
		in, out := &in.Items, &out.Items
		*out = make([]MobileClient, len(*in))
		for i := range *in {
			(*in)[i].DeepCopyInto(&(*out)[i])
		}
	}
	return
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new MobileClientList.
func (in *MobileClientList) DeepCopy() *MobileClientList {
	if in == nil {
		return nil
	}
	out := new(MobileClientList)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyObject is an autogenerated deepcopy function, copying the receiver, creating a new runtime.Object.
func (in *MobileClientList) DeepCopyObject() runtime.Object {
	if c := in.DeepCopy(); c != nil {
		return c
	}
	return nil
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *MobileClientService) DeepCopyInto(out *MobileClientService) {
	*out = *in
	return
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new MobileClientService.
func (in *MobileClientService) DeepCopy() *MobileClientService {
	if in == nil {
		return nil
	}
	out := new(MobileClientService)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *MobileClientSpec) DeepCopyInto(out *MobileClientSpec) {
	*out = *in
	return
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new MobileClientSpec.
func (in *MobileClientSpec) DeepCopy() *MobileClientSpec {
	if in == nil {
		return nil
	}
	out := new(MobileClientSpec)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *MobileClientStatus) DeepCopyInto(out *MobileClientStatus) {
	*out = *in
	if in.Services != nil {
		in, out := &in.Services, &out.Services
		*out = make([]MobileClientService, len(*in))
		copy(*out, *in)
	}
	return
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new MobileClientStatus.
func (in *MobileClientStatus) DeepCopy() *MobileClientStatus {
	if in == nil {
		return nil
	}
	out := new(MobileClientStatus)
	in.DeepCopyInto(out)
	return out
}
